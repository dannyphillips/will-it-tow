/* Production-only registration lives in app/sw-register.tsx. */
importScripts("/pwa-cache-policy.js");

var CACHE_NAME = "tow-static-v1";
var PRECACHE_URLS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== CACHE_NAME;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (!request || request.method !== "GET") return;

  var url;
  try {
    url = new URL(request.url);
  } catch (err) {
    return;
  }

  if (!self.towPwaPolicy.isStaticAssetRequest(request, url, self.location.origin)) {
    return;
  }

  event.respondWith(cacheStatic(request));
});

function cacheStatic(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var network = fetch(request)
        .then(function (response) {
          if (self.towPwaPolicy.isStorableResponse(response)) {
            cache.put(request, response.clone()).catch(function () {});
          }
          return response;
        })
        .catch(function () {
          return cached || new Response("", { status: 504, statusText: "Offline" });
        });

      return cached || network;
    });
  });
}
