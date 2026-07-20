const GHPATH = '/wh-cut';
const APP_PREFIX = 'wh-cut_';
const VERSION = '2.0.0';

// Список файлов, которые будут доступны офлайн
const URLS = [
    `${GHPATH}/`,
    `${GHPATH}/index.html`,
    `${GHPATH}/style.css`,
    `${GHPATH}/script.js`
];

const CACHE_NAME = APP_PREFIX + VERSION

// Установка Service Worker — кэшируем файлы
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

// Перехват запросов — отдаем из кэша, если есть
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

// Активация — удаляем старые кэши
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})