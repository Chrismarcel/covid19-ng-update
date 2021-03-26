require('dotenv').config()
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs-extra')
const { slugifyStr } = require('./utils')

const pageUrl = 'http://covid19.ncdc.gov.ng/'
const filePath = `${__dirname}/cases.json`

const extractValueFromCell = (cell) => {
  const value = cell.children[0].data
  return value.replace(/[,\n]/g, '').trim()
}

const scrapePage = async () => {
  try {
    const casesFile = await fs.readFile(filePath)
    const { total: prevTotal } = JSON.parse(casesFile)

    const response = await axios.get(pageUrl)
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
            data[state].confirmedCases = Number(extractValueFromCell(cell[index + 1]))
            data[state].activeCases = Number(extractValueFromCell(cell[index + 2]))
            data[state].discharged = Number(extractValueFromCell(cell[index + 3]))
            data[state].death = Number(extractValueFromCell(cell[index + 4]))
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
      await fs.writeFile(filePath, JSON.stringify(stats, null, 2))
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
