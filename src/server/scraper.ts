import dotenv from 'dotenv'
import cheerio from 'cheerio'
import { APP_ENV, DataKey } from '../constants'
import { slugifyStr } from '../utils'
import fs from 'fs-extra'
import axios from 'axios'
import path from 'path'
import { uploadFile } from '../config/cloudinary'

dotenv.config()

const urlToScrape = 'http://covid19.ncdc.gov.ng/'
// For some very weird reasons, writing to .json file prevents the push notification from being triggered
// Spent a lot of time trying to figure out what the issue is, I had to resort to using a .txt file instead
const fileName = process.env.CLOUDINARY_FILE_NAME || 'cases.txt'
export const casesFilePath = path.join(__dirname, '../..', 'src/server', fileName)

const extractValueFromCell = (cell: cheerio.Element): string | undefined => {
  const value = (cell as cheerio.TagElement).children[0].data
  return value?.replace(/[,\n]/g, '').trim()
}

// I noticed some states returned negative value
// As on the 27th of June, 2021, Abia state returned a value of -2 😐
const pickMaxValue = (value: cheerio.Element) => {
  return Math.max(0, Number(extractValueFromCell(value)))
}

type StatsDataField =
  | DataKey.CONFIRMED_CASES
  | DataKey.ACTIVE_CASES
  | DataKey.DISCHARGED
  | DataKey.DEATHS

export type Stats = {
  [key in StatsDataField]: number
}

export interface StateStats extends Stats {
  [DataKey.STATE]: string
}

export interface StatsData {
  states: StateStats[]
  total: Stats
}

const initialTotalStats: Stats = {
  [DataKey.CONFIRMED_CASES]: 0,
  [DataKey.ACTIVE_CASES]: 0,
  [DataKey.DISCHARGED]: 0,
  [DataKey.DEATHS]: 0,
}

const getStatsData = async () => {
  if (process.env.APP_ENV === APP_ENV.PROD) {
    const { data } = await axios.get(process.env.CLOUDINARY_FILE_URL || '')
    return data
  }

  const casesFile = await fs.readFile(casesFilePath)
  return JSON.parse(casesFile.toString()) as StatsData
}

interface PageScraperResponse {
  stats: Stats
  updated_stats: boolean
}

const scrapePage = (): Promise<PageScraperResponse> => {
  console.log('Scraping started..........')
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const { total: prevTotal } = await getStatsData()

        const response = await axios.get(urlToScrape)
        const $ = cheerio.load(response.data, { ignoreWhitespace: true })
        const statsByStates = $('table#custom1 tbody tr')

        const mapTableToField = (rows: cheerio.Cheerio): StatsData => {
          const data: StatsData = { states: [], total: initialTotalStats }
          rows.each((_, node) => {
            const cell = $(node).find('td')

            cell.each((index) => {
              if (index === 0) {
                const state = slugifyStr(extractValueFromCell(cell[index]) || '')
                if (state) {
                  data.states.push({
                    [DataKey.STATE]: state,
                    [DataKey.CONFIRMED_CASES]: pickMaxValue(cell[index + 1]),
                    [DataKey.ACTIVE_CASES]: pickMaxValue(cell[index + 2]),
                    [DataKey.DISCHARGED]: pickMaxValue(cell[index + 3]),
                    [DataKey.DEATHS]: pickMaxValue(cell[index + 4]),
                  })
                }
              }
            })
          })

          return data
        }

        const stats = mapTableToField(statsByStates)

        const currentTotal = stats.states.reduce((acc, curr) => {
          const totalConfirmed = acc[DataKey.CONFIRMED_CASES] + curr[DataKey.CONFIRMED_CASES]
          const totalActive = acc[DataKey.ACTIVE_CASES] + curr[DataKey.ACTIVE_CASES]
          const totalDischarged = acc[DataKey.DISCHARGED] + curr[DataKey.DISCHARGED]
          const totalDeaths = acc[DataKey.DEATHS] + curr[DataKey.DEATHS]

          return {
            [DataKey.CONFIRMED_CASES]: totalConfirmed,
            [DataKey.ACTIVE_CASES]: totalActive,
            [DataKey.DISCHARGED]: totalDischarged,
            [DataKey.DEATHS]: totalDeaths,
          }
        }, initialTotalStats)

        stats.total = currentTotal
        const updatedStats =
          prevTotal[DataKey.CONFIRMED_CASES] !== currentTotal[DataKey.CONFIRMED_CASES]

        // If there's a new update
        if (updatedStats) {
          const updateStatsEndpoint = `${process.env.HOST}/api/update`
          await fs.writeFile(casesFilePath, JSON.stringify(stats)).then(() => {
            if (process.env.APP_ENV === APP_ENV.PROD) {
              console.log('Uploading cases file..........')
              uploadFile(casesFilePath)
                .then(() => console.log('Upload done..........'))
                .catch((error) => {
                  console.log('Upload complete..........')
                  console.log('\n')
                  console.log(error)
                })
            }
          })
          await axios.post(updateStatsEndpoint, { stats })
        }
        resolve({
          stats: stats.total,
          updated_stats: updatedStats,
        })
      } catch (error) {
        // If timeout error, wait for 5 minutes and scrape page again
        if (error.code === 'ENOTFOUND') {
          setInterval(() => scrapePage(), 5 * 60 * 1000)
        } else {
          // TODO: Find more robust ways to handle errors
          console.log(error)
          reject(error)
        }
      } finally {
        console.log('Scraping complete..........')
      }
    })()
  })
}

if (require.main === module) {
  scrapePage()
}

export default scrapePage
