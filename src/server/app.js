import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import http from 'http'
import io from 'socket.io'
import handleSSR from './ssr'
import compression from 'compression'
import firebaseAdmin from '../config/firebase-admin'
import { DATA_KEYS } from '../constants'

dotenv.config()

const app = express()
const server = http.createServer(app)
const socket = io(server)

socket.on('connect', (socket) => {
  socket.on('disconnect', () => {
    // TODO: Handle socket disconnection
  })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())

app.get('/', (req, res) => {
  return res.send(handleSSR(req, res))
})

app.use('/', express.static(`${__dirname}/../client`))
app.use('/src', express.static('./src'))

const topic = 'covid19updates'

app.post('/update', (req, res) => {
  const { stats } = req.body
  const {
    total: {
      [DATA_KEYS.CONFIRMED_CASES]: confirmedCases,
      [DATA_KEYS.ACTIVE_CASES]: activeCases,
      [DATA_KEYS.DISCHARGED]: discharged,
      [DATA_KEYS.DEATHS]: deaths,
    },
  } = stats

  const data = {
    title: 'Covid-19 NG Update',
    body: `Confirmed - ${confirmedCases}, Active - ${activeCases}, Discharged - ${discharged}, Deaths - ${deaths}`,
  }

  firebaseAdmin
    .messaging()
    .send({ data, topic })
    .catch((err) => console.log(err))

  socket.emit('update_cases', { message: stats })

  return res.end()
})

app.post('/subscribe', (req, res) => {
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
})

app.post('/unsubscribe', (req, res) => {
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
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Listening on Port ${PORT}`))
