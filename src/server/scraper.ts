import dotenv from 'dotenv'
import cheerio from 'cheerio'
import { DataKey } from '../constants'
import { slugifyStr } from '../utils'
import fs from 'fs-extra'
import axios from 'axios'

dotenv.config()

const urlToScrape = 'http://covid19.ncdc.gov.ng/'
// For some very weird reasons, writing to .json file prevents the push notification from being triggered
// Spent a lot of time trying to figure out what the issue is, I had to resort to using a .txt file instead
const filePath = `${__dirname}/cases.txt`

const extractValueFromCell = (cell: cheerio.Element): string | undefined => {
  const value = (cell as cheerio.TagElement).children[0].data
  return value?.replace(/[,\n]/g, '').trim()
}

// I noticed some states returned negative value
// As on the 27th of June, 2021, Abia state returned a value of -2 😐
const pickMaxValue = (value: cheerio.Element) => {
  return Math.max(0, Number(extractValueFromCell(value)))
}

export type StatsDataField =
  | DataKey.CONFIRMED_CASES
  | DataKey.ACTIVE_CASES
  | DataKey.DISCHARGED
  | DataKey.DEATHS

export type StatsAggregate = {
  [key in StatsDataField]: number
}

type StatsDataMap = StatsAggregate & { [DataKey.TOTAL]: number }

export type StatsData = {
  [key: string]: StatsDataMap
}

const scrapePage = async () => {
  try {
    const casesFile = await fs.readFile(filePath)
    const { total: prevTotal } = JSON.parse(casesFile.toString())

    const response = await axios.get(urlToScrape)
    const $ = cheerio.load(response.data, { ignoreWhitespace: true })
    const statsByStates = $('table#custom1 tbody tr')

    const initialStatsValues: StatsDataMap = {
      [DataKey.CONFIRMED_CASES]: 0,
      [DataKey.ACTIVE_CASES]: 0,
      [DataKey.DISCHARGED]: 0,
      [DataKey.DEATHS]: 0,
      [DataKey.TOTAL]: 0
    }

    const mapTableToField = (rows: cheerio.Cheerio): StatsData => {
      const data: StatsData = {}
      rows.each((_, node) => {
        const cell = $(node).find('td')

        cell.each((index) => {
          if (index === 0) {
            const state = slugifyStr(extractValueFromCell(cell[index]))
            if (state) {
              data[state] = { ...initialStatsValues }
              data[state][DataKey.CONFIRMED_CASES] = pickMaxValue(cell[index + 1])
              data[state][DataKey.ACTIVE_CASES] = pickMaxValue(cell[index + 2])
              data[state][DataKey.DISCHARGED] = pickMaxValue(cell[index + 3])
              data[state][DataKey.DEATHS] = pickMaxValue(cell[index + 4])
            }
          }
        })
      })
      return data
    }

    const stats = mapTableToField(statsByStates)

    const currentTotal = Object.values(stats).reduce((acc, curr) => {
      const totalConfirmed = acc[DataKey.CONFIRMED_CASES] + curr[DataKey.CONFIRMED_CASES]
      const totalActive = acc[DataKey.ACTIVE_CASES] + curr[DataKey.ACTIVE_CASES]
      const totalDischarged = acc[DataKey.DISCHARGED] + curr[DataKey.DISCHARGED]
      const totalDeaths = acc[DataKey.DEATHS] + curr[DataKey.DEATHS]

      return {
        [DataKey.CONFIRMED_CASES]: totalConfirmed,
        [DataKey.ACTIVE_CASES]: totalActive,
        [DataKey.DISCHARGED]: totalDischarged,
        [DataKey.DEATHS]: totalDeaths,
        [DataKey.TOTAL]: 0
      }
    }, initialStatsValues)

    stats.total = currentTotal

    // If there's a new update
    if (prevTotal[DataKey.CONFIRMED_CASES] !== currentTotal[DataKey.CONFIRMED_CASES]) {
      const updateStatsEndpoint = `${process.env.HOST}/update`
      await fs.writeFile(filePath, JSON.stringify(stats))
      await axios.post(updateStatsEndpoint, { stats })
    }
  } catch (error) {
    // TODO: Find more robust ways to handle errors
    console.log(error)
    // If any error, wait for 2 minutes and scrape page again
    setInterval(() => scrapePage(), 2 * 60 * 1000)
  }
}

scrapePage()
