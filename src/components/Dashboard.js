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
import PopupBar from './PopupBar'
import { LOCAL_STORAGE_KEYS } from '../constants'

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
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const { total } = stats

  const setAlertStatus = ({ subscribed, notification }) => {
    setNotificationEnabled(subscribed)
    setSubscriptionEnabled(notification)
  }

  useEffect(() => {
    // FCM needs to be re-assigned inside of useEffect to prevent Firebase error of 'self is not defined'
    messaging = firebaseInit.messaging()
    messaging.onMessage((payload) => console.log(payload))

    // Prevent Firebase from throwing error about multiple VAPID keys being set
    if (!DOMReady) {
      messaging.usePublicVapidKey(FIREBASE_VAPID_KEY)
      // TODO: Probable migrate notification settings to IndexedDB as LocalStorage is synchronous/blocking
      const alertStatus = JSON.parse(localStorage.getItem(ALERT_STATUS))
      const notificationStatus = alertStatus?.notification
      const subscriptionStatus = alertStatus?.subscribed
      setAlertStatus({ subscribed: subscriptionStatus, notification: notificationStatus })

      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('../../sw.js')
            .then((registerSW) => {
              console.log('Successfully registered service worker')
              messaging.useServiceWorker(registerSW)
              // Retrieve token & subscribe user
              // If user has already subscribed but cleared their storage
              // or uninstalled their service worker
              registerSW.addEventListener('updatefound', () => {
                registerSW.installing.addEventListener('statechange', (event) => {
                  if (event.target.state === 'activated') {
                    if (notificationStatus && !subscriptionStatus) {
                      messaging.getToken().then(async (registrationToken) => {
                        if (registrationToken) {
                          localStorage.setItem(REGISTRATION_TOKEN, registrationToken)
                          localStorage.setItem(ALERT_STATUS, JSON.stringify({ subscribed: true, notification: notificationStatus }))

                          await handleSubscription()
                          setAlertStatus({ subscribed: true, notification: notificationStatus })
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
        })
      }
    }

    if (window.__INITIAL_DATA__) {
      const initialData = window.__INITIAL_DATA__
      setStats(initialData)
      delete window.__INITIAL_DATA__
    }

    setDOMReady(true)
  }, [subscriptionEnabled, notificationEnabled])

  useEffect(() => {
    // Update statistics if there are new cases
    socket.on('updated_cases', ({ message: stats }) => {
      setStats(stats)
    })
  }, [stats])

  const handlePermission = async () => {
    try {
      const registrationToken = await messaging.getToken()
      localStorage.setItem(REGISTRATION_TOKEN, registrationToken)
      setSubscriptionEnabled({ subscription: true, notification: true })
      showNotificationPopup(false)

      handleSubscription(notificationStatus)
    } catch (error) {
      if (error.code === 'messaging/permission-blocked') {
        // TODO: Display notification on how users can enable notifications later
        setAlertStatus({ subscribed: subscriptionEnabled, notification: notificationEnabled })
        setPopupVisible(false)
      }
    }
  }

  const handleSubscription = async (value) => {
    const endpoint = value ? 'subscribe' : 'unsubscribe'
    try {
      const registrationToken = localStorage.getItem(REGISTRATION_TOKEN)
      const {
        data: { statusCode },
      } = await axios.post(`${process.env.HOST}/${endpoint}`, { registrationToken })
      if (statusCode === 200) {
        setAlertStatus({ subscribed: value, notification: value })
      }
    } catch (error) {
      setAlertStatus({ notification: false, subscribed: false })
      // TODO: Display notification informing user of error while subscribing/unsubscribing
      throw new Error(error)
    }
  }

  const hideNotificationPopup = () => {
    setPopupVisible(false)
  }

  return (
    <>
      {DOMReady && (
        <NotificationContext.Provider
          value={{
            notificationEnabled,
            handleSubscription,
            handlePermission,
          }}>
          <div className="notif-popup-overlay" data-popup-open={popupVisible}></div>
          <main className="dashboard">
            <Header />
            <SummmaryPanel total={total} />
            <section className="map-stats-wrapper">
              <MapChart stats={stats} />
              <SummaryTable stats={stats} />
            </section>
          </main>

          {/* TODO: Move this to Portal */}
          <PopupBar popupVisible={popupVisible} className="notification-request">
            <p className="notification-message">Would you like to enable real time covid alerts?</p>
            <div className="notifications-button-group">
              <button className="btn btn-solid" onClick={handlePermission}>
                Yes
              </button>
              <button className="btn btn-hollow" onClick={hideNotificationPopup}>
                No
              </button>
            </div>
          </PopupBar>
        </NotificationContext.Provider>
      )}
    </>
  )
}

export default Dashboard
