/* Service worker: serve ficheiros guardados para uso sem internet.
   A página nova vem sempre da rede quando há internet (para receber atualizações);
   mapas, fotos e bibliotecas saem da cache "sl-offline-v1" se tiverem sido descarregados. */
const OFF = 'sl-offline-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;           // serviços externos (satélite detalhado, ruas…) só online
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r).catch(async () => {
        const c = await caches.open(OFF);
        return (await c.match(r, { ignoreSearch: true })) ||
               (await c.match(new URL('./', self.registration.scope).href)) ||
               (await c.match(new URL('index.html', self.registration.scope).href)) ||
               Response.error();
      })
    );
    return;
  }
  e.respondWith(
    caches.open(OFF).then(async c => {
      let hit = await c.match(r.url);
      if (!hit && u.search) hit = await c.match(r, { ignoreSearch: true });
      return hit || fetch(r);
    })
  );
});
