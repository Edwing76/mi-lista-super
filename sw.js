const CACHE_NAME = 'superlist-v3'; // Incrementa este número cada vez que cambies algo
const assets = [
  'index.html',
  'crear.html',
  'lista.html',
  'estilos.css'
];

// Instalar y forzar activación inmediata
self.addEventListener('install', event => {
  self.skipWaiting(); // <--- ESTO ES CLAVE: Activa el nuevo SW sin esperar
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Limpiar cachés antiguas para que no ocupen espacio
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Estrategia: Intentar red primero, si falla, usar caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});