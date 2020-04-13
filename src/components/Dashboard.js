import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react'
import socketClient from 'socket.io-client'
import dotenv from 'dotenv'
import axios from 'axios'
import MapChart from './MapChart'
import SummmaryPanel from './SummaryBlock'
import SummaryTable from './SummaryTable'
import firebaseInit from '../config/firebaseInit'

dotenv.config()

const socket = socketClient(process.env.HOST)

const initialState = {
  total: {
    confirmedCases: 0,
    death: 0,
    admitted: 0,
    discharged: 0
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState(initialState)
  const [vapidKeySet, setVapidKey] = useState(false)
  const { total } = stats
  let messaging

  useEffect(() => {
    // FCM needs to be initialized inside of useEffect to prevent Firebase error of 'self is not defined'
    messaging = firebaseInit.messaging()

    // Prevent Firebase from throwing error about multiple VAPID keys being set
    if (!vapidKeySet) {
      messaging.usePublicVapidKey(
        'BC3mXezEfA6tfalai7D3nKl98i6iiWBS1fWchketvSPcfd5DJ_rJxuxm9PsAfrI-jjyJd-RdumUKKr0G-InetlU'
      )

      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            messaging.useServiceWorker(registration)
            console.log('Successfully registered service worker')
          })
          .catch(error => console.log('Failed to register service worker', error))
        })
      }
    }

    if (window.__INITIAL_DATA__) {
      const initialData = window.__INITIAL_DATA__
      setStats(initialData)
      delete window.__INITIAL_DATA__
    }

    // Update statistics if there are new cases
    socket.on('updated cases', ({ message: stats }) => {
      setStats(stats)
    })

    setVapidKey(true)
  }, [stats])

  const enableNotifications = async () => {
    try {
      await messaging.requestPermission()
      const registrationToken = await messaging.getToken()
      const {data: { statusCode }} = await axios.post(`${process.env.HOST}/subscribe`, { registrationToken })
      if (statusCode === 200) {
        localStorage.setItem('registrationToken', registrationToken)
      } else {
        localStorage.removeItem('registrationToken')
      }
    } catch (error) {
      localStorage.removeItem('registrationToken')
    }
  }

  return (
    <main className="dashboard">
      <h1 className="dashboard-title">Covid-19 NG Update</h1>
      <button onClick={enableNotifications}>
        Enable notifications
      </button>
      <SummmaryPanel total={total} />
      <section className="map-stats-wrapper">
        <MapChart stats={stats} />
        <SummaryTable stats={stats} />
      </section>
    </main>
  )
}

export default Dashboard
