const cheerio = require('cheerio')
const axios = require('axios')
const { promisify } = require("util");
const fs = require('fs')
const { slugifyStr, trimStr }  = require('./utils')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const pageUrl = 'http://covid19.ncdc.gov.ng/'
const filePath = './cases.json'

const scrapePage = async () => {
  try {
    const casesFile = await readFile(filePath)
    const prevCases = JSON.parse(casesFile)

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
            const key = slugifyStr(trimStr($(cell[index])))
            const value = Number(trimStr($(cell[index + 1])))
            data[key] = value
          }
        })
      })

      return data
    }

    const summary = mapTableToJSON(summaryTable)
    const cases = mapTableToJSON(casesByStates)

    const updatedCases = JSON.stringify({ ...prevCases, summary, cases }, null, 2)
    await writeFile(filePath, updatedCases)
  } catch (error) {
    setInterval(() => scrapePage(), 3600)
  }
}

const readCasesFromFile = async filePath => {
  if (fs.existsSync(filePath)) {
    const casesFile = await readFile(filePath)
    const prevCases = JSON.parse(casesFile)

    return prevCases
  }

  createCasesFile()
}

const createCasesFile = (filePath) => {

}

scrapePage()
