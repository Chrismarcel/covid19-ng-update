require('dotenv').config()
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs-extra')
const { slugifyStr, trimStr }  = require('./utils')

const pageUrl = 'http://covid19.ncdc.gov.ng/'
const filePath = `${__dirname}/cases.json`

const scrapePage = async () => {
  try {
    const casesFile = await fs.readFile(filePath)
    const {total: prevTotal} = JSON.parse(casesFile)

    const response = await axios.get(pageUrl)
    const $ = cheerio.load(response.data)
    const statsByStates = $('table#custom1 tbody tr')

    const mapTableToField = (rows) => {
      const data = {}
      rows.each((_, element) => {
        const cell = $(element).find('td')
    
        cell.each(index => {
          if (index === 0) {
            const state = slugifyStr(trimStr($(cell[index])))
            const value = trimStr($(cell[index + 1])).replace(/,/, '') // Strip commas
            data[state] = {}
            data[state].confirmedCases = Number(value)
            data[state].activeCases = Number(trimStr($(cell[index + 2])))
            data[state].discharged = Number(trimStr($(cell[index + 3])))
            data[state].death = Number(trimStr($(cell[index + 4])))
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
      death: 0
    }

    const currentTotal = Object.values(stats).reduce((accumulator, currentValue) => {
      return {
        confirmedCases: accumulator.confirmedCases + currentValue.confirmedCases,
        activeCases: accumulator.activeCases + currentValue.activeCases,
        discharged: accumulator.discharged + currentValue.discharged,
        death: accumulator.death + currentValue.death
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
    console.log(error)
    // TODO: Find more robust ways to handle errors
    // If any error, wait for 2 minutes and scrape page again
    setInterval(() => scrapePage(), 2 * 60 * 1000)
  }
}

scrapePage()
