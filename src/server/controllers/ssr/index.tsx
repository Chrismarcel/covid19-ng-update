import path from 'path'
import fs from 'fs-extra'
import $ from 'cheerio'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import App from '../../../client/App'
import { casesFilePath } from '../../scraper'
import https from 'https'
import { APP_ENV } from '../../../constants'
import { Request } from 'express'

const templatePath = path.join(__dirname, '..', 'client', 'index.html')
const HTMLTemplateString = fs.readFileSync(`${templatePath}`)

const handleSSR = (req: Request) => {
  const renderedTemplate = $.load(HTMLTemplateString)
  const context = {}
  const cases = fs.readFileSync(casesFilePath).toString()

  if (process.env.APP_ENV === APP_ENV.DEV) {
    const casesFile: fs.WriteStream = fs.createWriteStream(casesFilePath)
    https.get(process.env.CLOUDINARY_FILE_URL || '', (res) => {
      res.pipe(casesFile)
      res.on('end', () => res.unpipe())
    })
  }

  renderedTemplate('#app').html(
    renderToString(
      <StaticRouter context={context} location={req.originalUrl}>
        <App />
      </StaticRouter>
    )
  )

  renderedTemplate('body').after(`
    <script>
      window.__INITIAL_DATA__ = ${cases}
    </script>`)

  return renderedTemplate.html()
}

export default handleSSR
