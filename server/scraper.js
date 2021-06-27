require('dotenv').config()
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs-extra')
const { slugifyStr } = require('./utils')
const { DATA_KEYS } = require('../src/constants')

const urlToScrape = 'http://covid19.ncdc.gov.ng/'
// For some very weird reasons, writing to .json file prevents the push notification from being triggered
// Spent a lot of time trying to figure out what the issue is, I had to resort to using a .txt file instead
const filePath = `${__dirname}/cases.txt`

const extractValueFromCell = (cell) => {
  const value = cell.children[0].data
  return value.replace(/[,\n]/g, '').trim()
}

// I noticed some states returned negative value
// As on the 27th of June, 2021, Abia state returned a value of -2 😐
const pickMaxValue = (value) => {
  return Math.max(0, Number(extractValueFromCell(value)))
}

const scrapePage = async () => {
  try {
    const casesFile = await fs.readFile(filePath)
    const { total: prevTotal } = JSON.parse(casesFile)

    const response = await axios.get(urlToScrape)
    const $ = cheerio.load(response.data, { ignoreWhitespace: true })
    const statsByStates = $('table#custom1 tbody tr')

    const mapTableToField = (rows) => {
      const data = {}
      rows.each((_, element) => {
        const cell = $(element).find('td')

        cell.each((index) => {
          if (index === 0) {
            const state = slugifyStr(extractValueFromCell(cell[index]))
            data[state] = {}
            data[state][DATA_KEYS.CONFIRMED_CASES] = pickMaxValue(cell[index + 1])
            data[state][DATA_KEYS.ACTIVE_CASES] = pickMaxValue(cell[index + 2])
            data[state][DATA_KEYS.DISCHARGED] = pickMaxValue(cell[index + 3])
            data[state][DATA_KEYS.DEATHS] = pickMaxValue(cell[index + 4])
          }
        })
      })
      return data
    }

    const stats = mapTableToField(statsByStates)
    const initialValue = {
      [DATA_KEYS.CONFIRMED_CASES]: 0,
      [DATA_KEYS.ACTIVE_CASES]: 0,
      [DATA_KEYS.DISCHARGED]: 0,
      [DATA_KEYS.DEATHS]: 0,
    }

    const currentTotal = Object.values(stats).reduce((acc, curr) => {
      const totalConfirmed = acc[DATA_KEYS.CONFIRMED_CASES] + curr[DATA_KEYS.CONFIRMED_CASES]
      const totalActive = acc[DATA_KEYS.ACTIVE_CASES] + curr[DATA_KEYS.ACTIVE_CASES]
      const totalDischarged = acc[DATA_KEYS.DISCHARGED] + curr[DATA_KEYS.DISCHARGED]
      const totalDeaths = acc[DATA_KEYS.DEATHS] + curr[DATA_KEYS.DEATHS]

      return {
        [DATA_KEYS.CONFIRMED_CASES]: totalConfirmed,
        [DATA_KEYS.ACTIVE_CASES]: totalActive,
        [DATA_KEYS.DISCHARGED]: totalDischarged,
        [DATA_KEYS.DEATHS]: totalDeaths,
      }
    }, initialValue)

    stats.total = currentTotal

    // If there's a new update
    if (prevTotal[DATA_KEYS.CONFIRMED_CASES] !== currentTotal[DATA_KEYS.CONFIRMED_CASES]) {
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
