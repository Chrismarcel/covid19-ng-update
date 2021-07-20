import path from 'path'
import fs from 'fs-extra'
import $ from 'cheerio'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import App from '../../../client/App'
import { casesFilePath } from '../../scraper'
import { APP_ENV } from '../../../constants'
import { Request } from 'express'
import axios from 'axios'

const templatePath = path.join(__dirname, '..', 'client', 'index.html')
const HTMLTemplateString = fs.readFileSync(`${templatePath}`)

const renderInitialData = (data: string, renderer: cheerio.Root) => {
  renderer('body').after(`
  <script>
    window.__INITIAL_DATA__ = ${data}
  </script>`)

  return renderer.html()
}

const handleSSR = (req: Request): Promise<string> => {
  const renderedTemplate = $.load(HTMLTemplateString)
  const context = {}

  renderedTemplate('#app').html(
    renderToString(
      <StaticRouter context={context} location={req.originalUrl}>
        <App />
      </StaticRouter>
    )
  )

  // Heroku runs an ephemeral file system, so there are chances that data we write don't get persisted
  // To fix this, on PROD, we would only be reading from a remote file on Cloudinary
  if (process.env.APP_ENV === APP_ENV.PROD) {
    return axios.get(process.env.CLOUDINARY_FILE_URL).then((res) => {
      return renderInitialData(JSON.stringify(res.data), renderedTemplate)
    })
  } else {
    const cases = fs.readFileSync(casesFilePath).toString()
    return Promise.resolve(renderInitialData(cases, renderedTemplate))
  }
}

export default handleSSR
