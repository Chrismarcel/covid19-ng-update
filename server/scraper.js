require('dotenv').config()
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs-extra')
const { slugifyStr } = require('./utils')

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
            data[state].confirmedCases = pickMaxValue(cell[index + 1])
            data[state].activeCases = pickMaxValue(cell[index + 2])
            data[state].discharged = pickMaxValue(cell[index + 3])
            data[state].death = pickMaxValue(cell[index + 4])
          }
        })
      })
      return data
    }

    const stats = mapTableToField(statsByStates)
    const initialValue = {
      confirmedCases: 0,
      activeCases: 0,
      discharged: 0,
      death: 0,
    }

    const currentTotal = Object.values(stats).reduce((accumulator, currentValue) => {
      return {
        confirmedCases: accumulator.confirmedCases + currentValue.confirmedCases,
        activeCases: accumulator.activeCases + currentValue.activeCases,
        discharged: accumulator.discharged + currentValue.discharged,
        death: accumulator.death + currentValue.death,
      }
    }, initialValue)

    stats.total = currentTotal

    // If there's a new update
    if (prevTotal.confirmedCases !== currentTotal.confirmedCases) {
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
