/* Offline support for honeybearkatherine.org
 *
 * Deliberately conservative, because of what this site carries:
 *   - Only same-origin GET requests are ever cached.
 *   - The search index and any query is never cached, so a search leaves
 *     no trace on the device.
 *   - Network is tried first for pages, so nobody reads a stale hotline
 *     number; the cache is a fallback for when the connection is gone.
 *   - Nothing is sent anywhere. There is no push, no sync, no analytics.
 */

const VERSION = "hbk-v1";
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

/* Pages worth having when there is no signal. The help pages come first:
   somebody may need a hotline number in a place with no reception. */
const PRECACHE = [
  "/",
  "/offline",
  "/harbor-of-hope",
  "/resources",
  "/shows",
  "/images/hbk777-mark.png",
  "/icons/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheable(url) {
  if (url.origin !== self.location.origin) return false;
  // Never cache the search index or its fragments — a cached search is a
  // record of what somebody looked for.
  if (url.pathname.startsWith("/pagefind/")) return false;
  return true;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!isCacheable(url)) return;

  // Pages: network first, so content is never stale when online.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((hit) => hit || caches.match("/offline") || caches.match("/")),
        ),
    );
    return;
  }

  // Assets: cache first, they are fingerprinted or static.
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(RUNTIME).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
