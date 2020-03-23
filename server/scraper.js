const cheerio = require('cheerio')
const axios = require('axios')
const { promisify } = require("util");
const fs = require('fs')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const pageUrl = 'http://covid19.ncdc.gov.ng/'
const filePath = './cases.json'

const slugifyKey = (str) => str.toLowerCase().replace(/ /g, '_')

const trimStr = (element) => element.text().trim()

const scrapePage = async () => {
  try {
    const casesFile = await readFile(filePath)
    const cases = JSON.parse(casesFile)

    const response = await axios.get(pageUrl)
    const $ = cheerio.load(response.data)
    const summaryTable = $('table#custom1 tbody tr')
    const casesByStates = $('table#custom3 tbody tr')

    const mapTableToJSON = (rows) => {
      const data = {}
      rows.each((_, element) => {
        const cell = $(element).find('td')
    
        cell.each(index => {
          if (index % 2 === 0) {
            const key = slugifyKey(trimStr($(cell[index])))
            const value = Number(trimStr($(cell[index + 1])))
            data[key] = value
          }
        })
      })

      return data
    }

    const summary = mapTableToJSON(summaryTable)
    const states = mapTableToJSON(casesByStates)

    const updatedCases = JSON.stringify({ ...cases, summary, states }, null, 2)
    await writeFile(filePath, updatedCases)
  } catch (error) {
    console.log(error)
  }
}

scrapePage()
