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
    const updateStatsEndpoint = `${process.env.HOST}/update`

    const response = await axios.get(pageUrl)
    const $ = cheerio.load(response.data)
    const statsByStates = $('table#custom3 tbody tr')

    const mapTableToField = (rows) => {
      const data = {}
      rows.each((_, element) => {
        const cell = $(element).find('td')
    
        cell.each(index => {
          if (index === 0) {
            const key = slugifyStr(trimStr($(cell[index])))
            data[key] = {}
            data[key].confirmedCases = Number(trimStr($(cell[index + 1])))
            data[key].admitted = Number(trimStr($(cell[index + 2])))
            data[key].discharged = Number(trimStr($(cell[index + 3])))
            data[key].death = Number(trimStr($(cell[index + 4])))
          }
        })
      })
      return data
    }
    
    const stats = mapTableToField(statsByStates)
    const { total: currentTotal } = stats

    // If there's a new update
    if (prevTotal.confirmedCases !== currentTotal.confirmedCases) {
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
