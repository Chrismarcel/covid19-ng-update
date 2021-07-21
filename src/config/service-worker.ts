import { LOCAL_STORAGE_KEYS } from '../constants'
import { deviceSupportsNotification } from '../utils'
import { FIREBASE_VAPID_KEY } from './firebase-client'
import firebase from 'firebase'

const { ALERT_STATUS, REGISTRATION_TOKEN } = LOCAL_STORAGE_KEYS

interface InitServiceWorkerParams {
  messaging: firebase.messaging.Messaging
  handleSubscription: (subscribedUser: boolean) => void
  alertStatus: boolean
}

const initServiceWorker = ({
  messaging,
  handleSubscription,
  alertStatus,
}: InitServiceWorkerParams) => {
  navigator.serviceWorker
    .register('../../sw.js')
    .then((serviceWorker) => {
      console.log('Successfully registered service worker')
      if (deviceSupportsNotification()) {
        messaging.getToken({
          vapidKey: FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: serviceWorker,
        })
      }
      // Retrieve token & subscribe user
      // If user has already subscribed but cleared their storage
      // or uninstalled their service worker
      serviceWorker.addEventListener('updatefound', () => {
        serviceWorker.installing!.addEventListener('statechange', (event) => {
          if (event.target && event.target.state === 'activated') {
            if (!alertStatus && deviceSupportsNotification()) {
              messaging
                .getToken()
                .then(async (registrationToken: string) => {
                  if (registrationToken) {
                    localStorage.setItem(REGISTRATION_TOKEN, registrationToken)
                    localStorage.setItem(ALERT_STATUS, 'true')

                    await handleSubscription(true)
                  }
                })
                .catch((error) => console.log('Error getting token', error))
            }
          }
        })
      })
    })
    .catch((error) => {
      console.log('Failed to register service worker', error)
    })
}

export default initServiceWorker
