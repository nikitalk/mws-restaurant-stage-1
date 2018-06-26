'use strict';

const staticCacheName = 'restaurant-review-cache';
const forCache = [
    '/',
    'js/main.js',
    'css/styles.css',
    'js/dbhelper.js',
    'index.html',
    'restaurant.html',
    'js/main.js',
    'js/restaurant_info.js',
    'data/restaurants.json',
    'https://fonts.gstatic.com/s/amaticsc/v11/TUZyzwprpvBS1izr_vOEDuSfU5cP1V3r.woff2',
    'https://fonts.gstatic.com/s/opensans/v15/mem8YaGs126MiZpBA-UFWJ0bf8pkAp6a.woff2'
];

function pushToForCache(num) {
    for (let i = 1; i <= num; i++) {
        forCache.push(`img/${i}.jpg`);
        forCache.push(`restaurant.html?id=${i}`);
    }
};

self.addEventListener('install', function(event) {
    console.log('Installing service worker and cache');
    pushToForCache(10); // Adding to forCache variable names of images and paths of restaurant.html!id=number
    event.waitUntil(caches.open(staticCacheName).then(function(cache) {
        return cache.addAll(forCache);
    }));
});

self.addEventListener('activate', function(event) {
    console.log('Activating new service worker');
    event.waitUntil(caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
        }).map(function(cacheName) {
            return caches.delete(cacheName);
        }));
    }));
});

self.addEventListener('fetch', function(event) {
    console.log('Fetching event for ', event.request.url);
    event.respondWith(caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
    }));
});