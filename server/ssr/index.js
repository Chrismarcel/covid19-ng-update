import path from 'path'
import fs from 'fs'
import $ from 'cheerio'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import App from '../../src/App'
import cases from '../cases.json'

const templatePath = path.join(__dirname, '..', 'client', 'index.html')
const HTMLTemplateString = fs.readFileSync(`${templatePath}`)

const serializedData = JSON.stringify(cases)

const handleSSR = req => {
  const renderedTemplate = $.load(HTMLTemplateString)
  const context = {}

  renderedTemplate('#app').html(
    renderToString(
      <StaticRouter context={context} location={req.originalUrl}>
        <App />
      </StaticRouter>
    )
  );

  renderedTemplate('body').after(`
    <script>
      window.__INITIAL_DATA__ = ${serializedData}
    </script>`
  )
  
  return renderedTemplate.html()
}

export default handleSSR
