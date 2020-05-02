import 'regenerator-runtime/runtime'
import React, { useState, useEffect, useReducer, createContext } from 'react'
import socketClient from 'socket.io-client'
import dotenv from 'dotenv'
import axios from 'axios'
import MapChart from './MapChart'
import SummmaryPanel from './SummaryBlock'
import SummaryTable from './SummaryTable'
import firebaseInit, { FIREBASE_VAPID_KEY } from '../config/firebaseInit'
import Header from './Header'
import PopupBar from './PopupBar'
import { LOCAL_STORAGE_KEYS } from '../util'

dotenv.config()

const socket = socketClient(process.env.HOST)

export const NotificationContext = createContext()

const initialState = {
  total: {
    confirmedCases: 0,
    death: 0,
    activeCases: 0,
    discharged: 0
  }
}

let messaging, subscriptionStatus, notificationStatus
const { NOTIFICATION_STATUS, SUBSCRIPTION_STATUS, REGISTRATION_TOKEN } = LOCAL_STORAGE_KEYS

const Dashboard = () => {
  const [stats, setStats] = useState(initialState)
  const [DOMInit, setDOMInit] = useState(true)
  const [subscriptionEnabled, setSubscriptionStatus] = useState(false)
  const [notificationEnabled, setNotificationStatus] = useState(false)
  const [notificationPopupVisible, showNotificationPopup] = useState(false)
  const { total } = stats

  useEffect(() => {
    // FCM needs to be initialized inside of useEffect to prevent Firebase error of 'self is not defined'
    messaging = firebaseInit.messaging()
    messaging.onMessage(payload => console.log(payload))

    // Prevent Firebase from throwing error about multiple VAPID keys being set
    if (DOMInit) {
      messaging.usePublicVapidKey(FIREBASE_VAPID_KEY)
      notificationStatus = JSON.parse(localStorage.getItem(NOTIFICATION_STATUS))
      subscriptionStatus = JSON.parse(localStorage.getItem(SUBSCRIPTION_STATUS))

      setSubscriptionStatus(Boolean(subscriptionStatus))
      setNotificationStatus(Boolean(notificationStatus))
      showNotificationPopup(Boolean(!notificationStatus))

      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('../../sw.js')
          .then(registration => {
            console.log('Successfully registered service worker')
            messaging.useServiceWorker(registration)
            // Retrieve token & subscribe user
            // If user has already subscribed but cleared their storage
            // or uninstalled their service worker
            registration.addEventListener('updatefound', () => {
              registration.installing.addEventListener('statechange', event => {
                if (event.target.state === 'activated') {
                  const notificationStatus = JSON.parse(localStorage.getItem(NOTIFICATION_STATUS))
                  const subscriptionStatus = JSON.parse(localStorage.getItem(SUBSCRIPTION_STATUS))
                  if (Boolean(notificationStatus) && !subscriptionStatus) {
                    messaging.getToken().then(registrationToken => {
                      if (registrationToken) {
                        localStorage.setItem(REGISTRATION_TOKEN, registrationToken)
                        localStorage.setItem(SUBSCRIPTION_STATUS, true)
                        subscribeUser()
                        setSubscriptionStatus(true)
                      }
                    })
                  }
                }
              })
            })
          })
          .catch(error => {
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

    if ("Notification" in window) {
      if (Notification.permission === 'denied') {
        localStorage.setItem(NOTIFICATION_STATUS, false)
        setNotificationStatus(false)
        setSubscriptionStatus(false)
        showNotificationPopup(false)
      } else if (Notification.permission === 'granted') {
        localStorage.setItem(NOTIFICATION_STATUS, true)
        setNotificationStatus(true)
        showNotificationPopup(false)
      }
    }

    // Update statistics if there are new cases
    socket.on('updated cases', ({ message: stats }) => {
      setStats(stats)
    })

    setDOMInit(false)
  }, [stats, subscriptionEnabled, notificationEnabled])

  const requestNotificationPermission = async () => {
    try {
      const registrationToken = await messaging.getToken()
      localStorage.setItem(NOTIFICATION_STATUS, true)
      localStorage.setItem(REGISTRATION_TOKEN, registrationToken)
      setNotificationStatus(true)
      showNotificationPopup(false)

      subscribeUser()
      setSubscriptionStatus(true)
    } catch (error) {
      if (error.code === 'messaging/permission-blocked') {
        // TODO: Display notification on how users can enable notifications later
        setNotificationStatus(true)
        showNotificationPopup(false)
        localStorage.setItem(NOTIFICATION_STATUS, false)
      }
    }
  }

  const subscribeUser = async () => {
    try {
      const registrationToken = localStorage.getItem(REGISTRATION_TOKEN)
      const {data: { statusCode }} = await axios.post(`${process.env.HOST}/subscribe`, { registrationToken })
      if (statusCode === 200) {
        localStorage.setItem(SUBSCRIPTION_STATUS, true)
      } 
    } catch (error) {
      setSubscriptionStatus(false)
      // TODO: Display notification informing user of error while subscribing
      throw new Error(error)
    }
  }

  const unsubscribeUser = async () => {
    try {
      const registrationToken = localStorage.getItem(REGISTRATION_TOKEN)
      const {data: { statusCode }} = await axios.post(`${process.env.HOST}/unsubscribe`, { registrationToken })
      if (statusCode === 200) {
        localStorage.setItem(SUBSCRIPTION_STATUS, false)
      }
    } catch (error) {
      setSubscriptionStatus(true)
      // TODO: Display notification informing user of error while unsubscribing
      throw new Error(error)
    }
  }

  const hideNotificationPopup = () => {
    showNotificationPopup(false)
    localStorage.setItem(NOTIFICATION_STATUS, false)
  }

  return (
    <NotificationContext.Provider 
      value={{
        setSubscriptionStatus,
        subscriptionEnabled,
        notificationEnabled,
        subscribeUser,
        unsubscribeUser,
        requestNotificationPermission
      }}
    >
      <div className="notif-popup-overlay" data-popup-open={notificationPopupVisible}></div>
      <main className="dashboard">
        <Header />
        <SummmaryPanel total={total} />
        <section className="map-stats-wrapper">
          <MapChart stats={stats} />
          <SummaryTable stats={stats} />
        </section>
      </main>
      
      {/* TODO: Move this to Portal */}
      <PopupBar popupVisible={notificationPopupVisible} className="notification-request">
        <p className="notification-message">
          Would you like to enable real time covid alerts?
        </p>
        <div className="notifications-button-group">
          <button className="btn btn-solid" onClick={requestNotificationPermission}>
            Yes
          </button>
          <button className="btn btn-hollow" onClick={hideNotificationPopup}>
            No
          </button>
        </div>
      </PopupBar>
    </NotificationContext.Provider>
  )
}

export default Dashboard
