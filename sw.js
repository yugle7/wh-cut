const GHPATH = '/wh-cut';
const APP_PREFIX = 'whCut_';
const VERSION = '1.0.35';

const URLS = [
    `${GHPATH}/`,
    `${GHPATH}/index.html`,
    `${GHPATH}/style.css`,
    `${GHPATH}/tasks.js`,
    `${GHPATH}/script.js`,
    `${GHPATH}/sprite.svg`,
    `${GHPATH}/icon.svg`,
    `${GHPATH}/favicon.svg`
];

const CACHE_NAME = APP_PREFIX + VERSION;

// Установка — кешируем файлы и активируемся сразу
self.addEventListener('install', e => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(URLS);
            await self.skipWaiting();
        })()
    );
});

// Перехват запросов — сначала кеш, потом сеть (с fallback)
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);
    if (url.origin !== location.origin) return;

    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request)
                .then(response => {
                    if (!response.ok) throw new Error();
                    return response;
                })
                .catch(() =>
                    caches.match(`${GHPATH}/index.html`)
                )
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});

// Активация — удаляем старые кеши и захватываем управление
self.addEventListener('activate', function (e) {
    e.waitUntil((async () => {
        const cacheNames = await caches.keys();
        const validKeys = cacheNames.filter(key => key.startsWith(APP_PREFIX));
        const deletePromises = validKeys.map(async (key) => {
            if (key !== CACHE_NAME) {
                await caches.delete(key);
            }
        });
        await Promise.all(deletePromises);
        await self.clients.claim();
    })());
});