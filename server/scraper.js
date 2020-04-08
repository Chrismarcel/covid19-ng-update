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
    const {summary: prevSummary} = JSON.parse(casesFile)
    const updateStatsEndpoint = `${process.env.HOST}/update`

    const response = await axios.get(pageUrl)
    const $ = cheerio.load(response.data)
    const summaryTable = $('table#custom1 tbody tr')
    const casesByStates = $('table#custom3 tbody tr')

    const mapTableToField = (rows) => {
      const data = {}
      rows.each((_, element) => {
        const cell = $(element).find('td')
    
        cell.each(index => {
          if (index % 2 === 0) {
            const key = slugifyStr(trimStr($(cell[index])))
            const value = Number(trimStr($(cell[index + 1])))
            data[key] = value
          }
        })
      })

      return data
    }

    const summary = mapTableToField(summaryTable)
    const cases = mapTableToField(casesByStates)

    // If there's a new update
    if (prevSummary.total_confirmed_cases !== summary.total_confirmed_cases) {
      const updatedCases = { summary, cases }
      await fs.writeFile(filePath, JSON.stringify(updatedCases, null, 2))
      await axios.post(updateStatsEndpoint, { cases: updatedCases })
    }
  } catch (error) {
    console.log(error)
    // TODO: Find more robust ways to handle errors
    // If any error, wait for 2 minutes and scrape page again
    setInterval(() => scrapePage(), 2 * 60 * 1000)
  }
}

scrapePage()
