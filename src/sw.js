import firebaseInit from './config/firebaseInit'
firebaseInit.analytics()

let messaging = firebaseInit.messaging()
messaging.usePublicVapidKey('BC3mXezEfA6tfalai7D3nKl98i6iiWBS1fWchketvSPcfd5DJ_rJxuxm9PsAfrI-jjyJd-RdumUKKr0G-InetlU')

const CACHE_VERSION = 1
const CACHE_NAME = `cache-v${CACHE_VERSION}`
const urlsToCache = [
  '/',
  '/src.e31bb0bc.js',
  '/styles.6145e9cd.css',
  '/src/map/map-of-nigeria.json',
  'https://fonts.googleapis.com/css2?family=Sen:wght@400;700&family=Poppins:wght@600;700&display=swap'
]

self.addEventListener('activate', event => {
  window.messaging = messaging
  event.waitUntil(
    caches.keys().then(cacheNames => {
      Promise.all(cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName)
        }
      }))
    })
  )
})

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        return response
      }
      return fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        
        const clonedResponse = response.clone()
        caches.open(CACHE_NAME)
        .then(cache => cache.put(event.request, clonedResponse))

        return response
      })
    })
  )
})  
