import firebaseAdmin from '../../config/firebase-admin'
import { DataKey } from '../../constants'
import handleSSR from './ssr'
import { RequestHandler } from 'express'
import socketConfig from '../../config/socket'
import scrapePage from '../scraper'

const topic = 'covid19updates'
const title = 'Covid-19 NG Update'
const headerKey = 'X-Scraper-Auth-Token'

export const sendSSRPage: RequestHandler = async (req, res) => {
  const page = await handleSSR(req)
  return res.send(page)
}

export const scrapeData: RequestHandler = (req, res) => {
  const headers = req.headers
  const scraperToken = headers[headerKey.toLowerCase()]

  if (scraperToken !== process.env.SCRAPER_TOKEN) {
    return res.status(401).json({ status: 'unauthorized' })
  }

  scrapePage()
    .then(() => res.status(200).json({ status: 'ok' }))
    .catch((error) => {
      console.log(error)
      return res.status(500).json({ status: 'server error' })
    })
}

export const updateStats: RequestHandler = (req, res) => {
  const socket = socketConfig.get()
  const { stats } = req.body
  const {
    total: {
      [DataKey.CONFIRMED_CASES]: confirmedCases,
      [DataKey.ACTIVE_CASES]: activeCases,
      [DataKey.DISCHARGED]: discharged,
      [DataKey.DEATHS]: deaths,
    },
  } = stats

  const data = {
    title,
    body: `Confirmed - ${confirmedCases}, Active - ${activeCases}, Discharged - ${discharged}, Deaths - ${deaths}`,
  }

  const message = {
    topic,
    notification: data,
    webpush: {
      fcmOptions: {
        link: '/',
      },
    },
  }

  firebaseAdmin
    .messaging()
    .send(message)
    .catch((err) => console.log(err))

  socket.emit('update_cases', { message: stats })

  return res.end()
}

export const subscribeToAlerts: RequestHandler = (req, res) => {
  const { registrationToken } = req.body
  firebaseAdmin
    .messaging()
    .subscribeToTopic(registrationToken, topic)
    .then((response) => {
      return res.status(200).json({
        status: 200,
        message: 'Successfully subscribed to real time Covid alerts.',
        response,
      })
    })
    .catch(() => {
      return res.status(500).json({
        status: 500,
        error: 'Failed to subscribe to real time Covid alerts.',
      })
    })
}

export const unsubscribeFromAlerts: RequestHandler = (req, res) => {
  const { registrationToken } = req.body
  firebaseAdmin
    .messaging()
    .unsubscribeFromTopic(registrationToken, topic)
    .then((response) => {
      return res.status(200).json({
        status: 200,
        message: 'Successfully unsubscribed from real time Covid alerts.',
        response,
      })
    })
    .catch(() => {
      return res.status(500).json({
        status: 500,
        error: 'Failed to unsubscribe from real time Covid alerts.',
      })
    })
}
