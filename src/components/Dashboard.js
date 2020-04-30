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

dotenv.config()

const socket = socketClient(process.env.HOST)

export const NotificationContext = createContext()

const initialState = {
  total: {
    confirmedCases: 0,
    death: 0,
    admitted: 0,
    discharged: 0
  }
}

let messaging, subscriptionStatus, notificationStatus

const Dashboard = () => {
  const [stats, setStats] = useState(initialState)
  const [DOMInit, setDOMInit] = useState(true)
  const [subscriptionEnabled, setSubscriptionStatus] = useState(false)
  const [notificationEnabled, setNotificationStatus] = useState(false)
  const [overlayVisible, showOverlay] = useState(false)
  const { total } = stats

  useEffect(() => {
    // FCM needs to be initialized inside of useEffect to prevent Firebase error of 'self is not defined'
    messaging = firebaseInit.messaging()
    messaging.onMessage(payload => console.log(payload))

    // Prevent Firebase from throwing error about multiple VAPID keys being set
    if (DOMInit) {
      messaging.usePublicVapidKey(FIREBASE_VAPID_KEY)
      notificationStatus = JSON.parse(localStorage.getItem('allow-notifications'))
      subscriptionStatus = JSON.parse(localStorage.getItem('subscribed'))

      setSubscriptionStatus(Boolean(subscriptionStatus))
      setNotificationStatus(Boolean(notificationStatus))
      showOverlay(Boolean(!notificationStatus))

      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('../../sw.js')
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

    setDOMInit(false)
  }, [stats, subscriptionEnabled, notificationEnabled])

  const requestNotificationPermission = async () => {
    try {
      const registrationToken = await messaging.getToken()
      localStorage.setItem('allow-notifications', true)
      localStorage.setItem('registrationToken', registrationToken)
      setNotificationStatus(true)
      showOverlay(false)

      await subscribeUser()
      setSubscriptionStatus(true)
    } catch (error) {
      if (error.code === 'messaging/permission-blocked') {
        // TODO: Display notification on how users can enable notifications later
        setNotificationStatus(true)
        showOverlay(false)
        localStorage.setItem('allow-notifications', false)
      }
    }
  }

  const subscribeUser = async () => {
    try {
      const registrationToken = localStorage.getItem('registrationToken')
      const {data: { statusCode }} = await axios.post(`${process.env.HOST}/subscribe`, { registrationToken })
      if (statusCode === 200) {
        localStorage.setItem('subscribed', true)
      } 
    } catch (error) {
      setSubscriptionStatus(false)
      // TODO: Display notification informing user of error while subscribing
      throw new Error(error)
    }
  }

  const unsubscribeUser = async () => {
    try {
      const registrationToken = localStorage.getItem('registrationToken')
      const {data: { statusCode }} = await axios.post(`${process.env.HOST}/unsubscribe`, { registrationToken })
      if (statusCode === 200) {
        localStorage.setItem('subscribed', false)
      }
    } catch (error) {
      setSubscriptionStatus(true)
      // TODO: Display notification informing user of error while unsubscribing
      throw new Error(error)
    }
  }

  return (
    <NotificationContext.Provider 
      value={{
        setSubscriptionStatus,
        subscriptionEnabled,
        notificationEnabled,
        subscribeUser,
        unsubscribeUser
       }}
    >
      <div className="notif-popup-overlay" data-popup-open={overlayVisible}></div>
      <main className="dashboard">
        <Header />
        <SummmaryPanel total={total} />
        <section className="map-stats-wrapper">
          <MapChart stats={stats} />
          <SummaryTable stats={stats} />
        </section>
      </main>
      
      {/* TODO: Move this to Portal */}
      <PopupBar popupVisible={!notificationEnabled} className="notification-request">
        <p className="notification-message">
          Would you like to enable real time covid alerts?
        </p>
        <div className="notifications-button-group">
          <button className="btn btn-solid" id="yes" onClick={requestNotificationPermission}>Yes</button>
          <button className="btn btn-hollow" id="no" onClick={() => showOverlay(false)}>No</button>
        </div>
      </PopupBar>
    </NotificationContext.Provider>
  )
}

export default Dashboard
