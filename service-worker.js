/**
 * Songbook service worker.
 *
 * Caches the app shell so Songbook keeps working offline after the first visit.
 * Strategy:
 *   - Install: pre-cache the core app shell (HTML, CSS, JS, sample songs, key images).
 *   - Activate: clean up old caches when the version bumps.
 *   - Fetch: cache-first for app-shell assets, network-first with cache fallback for everything else.
 *
 * Offline behavior:
 *   - Core app shell (HTML, CSS, JS) works fully offline after first visit.
 *   - User songs are stored in localStorage — always available offline.
 *   - Starter pack JSONs are cached on first access so they work offline after import.
 *   - The tuner/metronome/practice tools work offline (Web Audio API, no network needed).
 *   - YouTube links in songs will not play offline (external network required).
 *
 * Bump CACHE_VERSION whenever you ship a release that changes any cached file.
 */
const CACHE_VERSION = 'songbook-v3';
const APP_SHELL = [
    './',
    './index.html',
    './styles/main.css',
    './js/app.js',
    './js/library.js',
    './js/onboarding.js',
    './data/sample-songs.js',
    './assets/songbook-banner.jpg',
    './assets/songbook-icon.png',
    './assets/songbook-icon-192.png',
    './assets/songbook-icon-180.png',
    './assets/songbook-wordmark.png',
    './assets/songbook-wordmark.webp',
    './manifest.json',
    './songs/campfire-classics.json',
    './songs/blues-101.json',
    './songs/holiday-classics.json',
    './songs/rosh-hashanah-acoustic.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Skip cross-origin requests (e.g., Google Fonts, YouTube) — let browser handle normally.
    if (url.origin !== self.location.origin) return;

    // Cache-first for same-origin assets.
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req).then((res) => {
                // Cache successful responses transparently so first-touch assets
                // (like a starter pack JSON) become offline-available too.
                if (res && res.status === 200 && res.type === 'basic') {
                    const copy = res.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
                }
                return res;
            }).catch(() => {
                // Offline fallback: return the cached index.html for navigation requests
                // so the app shell can display an offline-friendly UI.
                if (req.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                // For other requests (images, etc.), just fail gracefully.
                return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
});

// Handle messages from the main thread (e.g., skip waiting on update).
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
