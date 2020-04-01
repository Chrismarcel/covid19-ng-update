import Koa from 'koa'
import dotenv from 'dotenv'
import Router from '@koa/router'
import serve from 'koa-static'
import fs from 'fs'
import mount from 'koa-mount'

import covid19cases from './cases.json'
import renderSSR from './ssr'

dotenv.config()

const app = new Koa()
const router = new Router()

const filePath = './server/cases.json'
let fileUpdated = false
let currentCases = covid19cases

app.use(router.routes())
app.use(async (ctx, next) => {
  ctx.response.set("Cache-Control", "no-cache")
  ctx.response.set("Connection", "keep-alive")
  await next()
})

fs.watch(filePath, event => {
  if (event === 'change') {
    fileUpdated = true
    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw Error(err)
      }
      currentCases = JSON.parse(data)
    })
  }
})

router.get('/', ctx => {
  ctx.body = renderSSR(ctx)
})

app.use(mount('/', serve('./dist/client')))
app.use(mount('/src/', serve('./src')))

router.get('/updates', ctx => {
  ctx.response.set("Content-Type", "text/event-stream")
  ctx.response.status = 200
  
  return new Promise(resolve => {
    if (fileUpdated) {
      resolve(ctx.res.write(`data: ${JSON.stringify(currentCases)}\n\n`))
      fileUpdated = false
    }
  })
})

app.listen(process.env.PORT || 5000)
