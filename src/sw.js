import firebaseInit, { FIREBASE_VAPID_KEY } from './config/firebaseInit'

const CACHE_VERSION = 2
const CACHE_NAME = `cache-v${CACHE_VERSION}`

let messaging = firebaseInit.messaging()
messaging.usePublicVapidKey(FIREBASE_VAPID_KEY)

// messaging.setBackgroundMessageHandler(payload => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.'
//   };

//   return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

const urlsToCache = [
  '/',
  '/src.e31bb0bc.js',
  '/styles.6145e9cd.css',
  '/src/map/map-of-nigeria.json',
  'https://fonts.googleapis.com/css2?family=Sen:wght@400;700&family=Poppins:wght@600;700&display=swap'
]

// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       Promise.all(cacheNames.map(cacheName => {
//         if (cacheName !== CACHE_NAME) {
//           return caches.delete(cacheName)
//         }
//       }))
//     })
//   )
// })

// self.addEventListener('install', event => {
//   self.skipWaiting()
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//     .then(cache => cache.addAll(urlsToCache))
//   )
// })

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//     .then(response => {
//       if (response) {
//         return response
//       }
//       return fetch(event.request)
//       .then(response => {
//         if (!response || response.status !== 200 || response.type !== 'basic') {
//           return response
//         }
        
//         const clonedResponse = response.clone()
//         caches.open(CACHE_NAME)
//         .then(cache => {
//           if (event.request.method !== 'POST') {
//             return cache.put(event.request, clonedResponse)
//           }
//         })

//         return response
//       })
//     })
//   )
// })  
