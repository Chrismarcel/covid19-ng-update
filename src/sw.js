const CACHE_NAME = 'cache-v1'
const urlsToCache = [
  '/',
  '/src.e31bb0bc.js',
  'styles.6145e9cd.css',
  '/src/map-of-nigeria.json',
  'https://fonts.googleapis.com/css2?family=Sen:wght@400;700&family=Poppins:wght@600;700&display=swap'
]

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then(() => {
      console.log('Successfully registered service worker')
    })
    .catch(error => console.log('Failed to register service worker', error))
  })
}

self.addEventListener('install', event => {
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
