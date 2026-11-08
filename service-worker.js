/**
 * service-worker.js — faz o jogo funcionar sem internet.
 *
 * No primeiro acesso (com internet), guarda no celular todos os arquivos
 * da lista ARQUIVOS. Depois disso, o jogo abre mesmo offline.
 *
 * IMPORTANTE ao mudar o projeto:
 *   1. Criou ou renomeou um arquivo? Atualize a lista ARQUIVOS.
 *      (o teste tests/pwa.test.js avisa se faltar algum)
 *   2. Mudou qualquer arquivo? Aumente VERSAO, para os celulares baixarem a versão nova.
 */
const VERSAO = 'quarto-v1';

const ARQUIVOS = [
  './',
  './index.html',
  './tutorial.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/main.js',
  './js/pwa.js',
  './js/logica/pecas.js',
  './js/logica/regras.js',
  './js/logica/vitoria.js',
  './js/logica/grafo.js',
  './js/tela/bits.js',
  './js/tela/desenho.js',
  './js/tela/grafo.js',
  './js/tela/painel.js',
  './js/tela/tabuleiro.js',
  './assets/fonts/baloo-2-latin-600-normal.woff2',
  './assets/fonts/baloo-2-latin-800-normal.woff2',
  './assets/fonts/atkinson-hyperlegible-latin-400-normal.woff2',
  './assets/fonts/atkinson-hyperlegible-latin-700-normal.woff2',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
];

// Instalação: baixa e guarda todos os arquivos
self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(VERSAO)
      .then(cache => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

// Ativação: apaga caches de versões antigas
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Pedidos: responde com o que está guardado; se não tiver, busca na internet
self.addEventListener('fetch', evento => {
  if (evento.request.method !== 'GET') return;
  evento.respondWith(
    caches.match(evento.request, { ignoreSearch: true })
      .then(guardado => guardado || fetch(evento.request))
  );
});
