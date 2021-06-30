import firebaseAdmin from '../../config/firebase-admin'
import { DataKey } from '../../constants'
import handleSSR from './ssr'
import { RequestHandler } from 'express'
import socketInstance from '../../config/socket'

const topic = 'covid19updates'

export const sendSSRPage: RequestHandler = (req, res) => res.send(handleSSR(req))

export const updateStats: RequestHandler = (req, res) => {
  const socket = socketInstance.get()
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
    title: 'Covid-19 NG Update',
    body: `Confirmed - ${confirmedCases}, Active - ${activeCases}, Discharged - ${discharged}, Deaths - ${deaths}`,
  }

  firebaseAdmin
    .messaging()
    .send({ data, topic })
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
