// sw.js

const GHPATH = '/wh-cut';

// Префикс для кэша (меняйте при обновлении файлов)
const APP_PREFIX = 'wh-cut_';
const VERSION = '1.0.0';

// Список файлов, которые будут доступны офлайн
const URLS = [
    `${GHPATH}/`,
    `${GHPATH}/index.html`,
    `${GHPATH}/style.css`,
    `${GHPATH}/script.js`
];

// Установка Service Worker — кэшируем файлы
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(APP_PREFIX + VERSION).then(function(cache) {
      return cache.addAll(URLS);
    })
  );
});

// Перехват запросов — отдаем из кэша, если есть
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

// Активация — удаляем старые кэши
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      var cacheWhitelist = keyList.filter(function(key) {
        return key.indexOf(APP_PREFIX) === 0;
      });
      cacheWhitelist.push(APP_PREFIX + VERSION);
      return Promise.all(keyList.map(function(key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});