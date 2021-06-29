import 'regenerator-runtime/runtime'
import React, { useState, useEffect, createContext } from 'react'
import socketClient from 'socket.io-client'
import dotenv from 'dotenv'
import axios from 'axios'
import CountryMap from './CountryMap'
import SummmaryPanel from './SummaryBlock'
import SummaryTable from './SummaryTable'
import firebaseInit, { FIREBASE_VAPID_KEY } from '../../config/firebaseInit'
import Header from './Header'
import { DATA_KEYS, LOCAL_STORAGE_KEYS } from '../../constants'
import { LineChart, PieChart } from './Charts'
import { ColorSchemeContext, NotificationContext } from '../context'

dotenv.config()

const socket = socketClient(process.env.HOST)

const initialState = {
  total: {
    [DATA_KEYS.CONFIRMED_CASES]: 0,
    [DATA_KEYS.DEATHS]: 0,
    [DATA_KEYS.ACTIVE_CASES]: 0,
    [DATA_KEYS.DISCHARGED]: 0,
  },
}

let messaging
const { ALERT_STATUS, REGISTRATION_TOKEN, DARK_MODE } = LOCAL_STORAGE_KEYS

const Dashboard = () => {
  const [stats, setStats] = useState(initialState)
  const [DOMReady, setDOMReady] = useState(false)
  const [alertStatus, setAlertStatus] = useState(false)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

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

      const userPreferredScheme = localStorage.getItem(DARK_MODE)
      const validStorageValue = userPreferredScheme === 'true' || userPreferredScheme === 'false'

      const darkModeEnabled = userPreferredScheme
        ? validStorageValue
          ? JSON.parse(userPreferredScheme)
          : false
        : window?.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkModeEnabled(darkModeEnabled)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('../../../sw.js')
          .then((serviceWorker) => {
            console.log('Successfully registered service worker')
            messaging.getToken({
              vapidKey: FIREBASE_VAPID_KEY,
              serviceWorkerRegistration: serviceWorker,
            })
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
      const { data } = await axios.post(`${process.env.HOST}/${endpoint}`, {
        registrationToken,
      })
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
          <ColorSchemeContext.Provider value={{ darkModeEnabled, setDarkModeEnabled }}>
            <div className={darkModeEnabled ? 'dark' : ''}>
              <main className="dashboard">
                <Header />
                <SummmaryPanel total={stats.total} />
                <section className="charts-container">
                  <LineChart stats={stats} />
                  <PieChart stats={stats} />
                </section>
                <section className="map-stats-wrapper">
                  <CountryMap stats={stats} />
                  <SummaryTable stats={stats} />
                </section>
              </main>
            </div>
          </ColorSchemeContext.Provider>
        </NotificationContext.Provider>
      )}
    </>
  )
}

export default Dashboard
