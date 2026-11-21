// Guarda la app en el celular para que funcione sin señal. Con señal SIEMPRE pide la versión nueva
// (saltándose la copia del navegador); sin señal usa lo guardado.
const CACHE = "ritmo-paipa-v20";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "index.html", "plan.json"].map(u => new Request(u, { cache: "reload" })))));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;  // la hora exacta nunca sale de caché
  e.respondWith(
    fetch(e.request.url, { cache: "no-cache" }).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
