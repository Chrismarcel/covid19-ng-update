import 'regenerator-runtime/runtime'
import React, { useState, useEffect, createContext } from 'react'
import socketClient from 'socket.io-client'
import dotenv from 'dotenv'
import axios from 'axios'
import MapChart from './MapChart'
import SummmaryPanel from './SummaryBlock'
import SummaryTable from './SummaryTable'
import firebaseInit, { FIREBASE_VAPID_KEY } from '../config/firebaseInit'
import Header from './Header'
import { LOCAL_STORAGE_KEYS } from '../constants'
import AreaChartPanel from './Charts'

dotenv.config()

const socket = socketClient(process.env.HOST)

export const NotificationContext = createContext()

const initialState = {
  total: {
    confirmedCases: 0,
    death: 0,
    activeCases: 0,
    discharged: 0,
  },
}

let messaging
const { ALERT_STATUS, REGISTRATION_TOKEN } = LOCAL_STORAGE_KEYS

const Dashboard = () => {
  const [stats, setStats] = useState(initialState)
  const [DOMReady, setDOMReady] = useState(false)
  const [alertStatus, setAlertStatus] = useState(false)

  useEffect(() => {
    // FCM needs to be re-assigned inside of useEffect to prevent Firebase error of 'self is not defined'
    messaging = firebaseInit.messaging()

    // TODO: Handle foreground notification, e.g. display a toast once the data is updated
    messaging.onMessage((payload) => console.log(payload))

    // Prevent Firebase from throwing error about multiple VAPID keys being set
    if (!DOMReady) {
      // TODO: Probably migrate notification settings to IndexedDB as LocalStorage is synchronous/blocking
      const parsedStatus = Boolean(localStorage.getItem(ALERT_STATUS)) || false
      setAlertStatus(parsedStatus)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('../../sw.js')
          .then((serviceWorker) => {
            console.log('Successfully registered service worker')
            messaging.getToken({ vapidKey: FIREBASE_VAPID_KEY, serviceWorkerRegistration: serviceWorker })
            // Retrieve token & subscribe user
            // If user has already subscribed but cleared their storage
            // or uninstalled their service worker
            serviceWorker.addEventListener('updatefound', () => {
              serviceWorker.installing.addEventListener('statechange', (event) => {
                if (event.target.state === 'activated') {
                  if (!alertStatus) {
                    messaging.getToken().then(async (registrationToken) => {
                      if (registrationToken) {
                        localStorage.setItem(REGISTRATION_TOKEN, registrationToken)
                        localStorage.setItem(ALERT_STATUS, true)

                        await handleSubscription(true)
                      }
                    })
                  }
                }
              })
            })
          })
          .catch((error) => {
            console.log('Failed to register service worker', error)
          })
      }
    }

    if (window.__INITIAL_DATA__) {
      const initialData = window.__INITIAL_DATA__
      setStats(initialData)
      delete window.__INITIAL_DATA__
    }

    setDOMReady(true)
  }, [alertStatus])

  useEffect(() => {
    // Update stats if there are new cases
    socket.on('update_cases', ({ message: stats }) => {
      setStats(stats)
    })
  }, [stats])

  const handlePermission = async (alertStatus) => {
    try {
      const registrationToken = await messaging.getToken()
      localStorage.setItem(REGISTRATION_TOKEN, registrationToken)
      handleSubscription(alertStatus)
    } catch (error) {
      if (error.code === 'messaging/permission-blocked') {
        // TODO: Display notification on how users can enable notifications later
        setAlertStatus(false)
      }
    }
  }

  const handleSubscription = async (subscribeUser) => {
    const endpoint = subscribeUser ? 'subscribe' : 'unsubscribe'
    try {
      const registrationToken = localStorage.getItem(REGISTRATION_TOKEN)
      const { data } = await axios.post(`${process.env.HOST}/${endpoint}`, { registrationToken })
      if (data.status === 200 && subscribeUser) {
        setAlertStatus(true)
        localStorage.setItem(ALERT_STATUS, true)
      } else {
        setAlertStatus(false)
        localStorage.removeItem(ALERT_STATUS)
        localStorage.removeItem(REGISTRATION_TOKEN)
      }
    } catch (error) {
      setAlertStatus(false)
      // TODO: Display notification informing user of error while subscribing/unsubscribing
      throw new Error(error)
    }
  }

  return (
    <>
      {DOMReady && (
        <NotificationContext.Provider value={{ handlePermission, alertStatus }}>
          <main className="dashboard">
            <Header />
            <SummmaryPanel total={stats.total} />
            <section>
              <AreaChartPanel />
            </section>
            <section className="map-stats-wrapper">
              <MapChart stats={stats} />
              <SummaryTable stats={stats} />
            </section>
          </main>
        </NotificationContext.Provider>
      )}
    </>
  )
}

export default Dashboard
