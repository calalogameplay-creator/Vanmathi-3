/* Vanmathi - Service Worker + Firebase Cloud Messaging */

importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBona_hpgGGyidPf9m4q1VFmrD21dGg-sA',
  authDomain: 'vanmathi.firebaseapp.com',
  projectId: 'vanmathi',
  storageBucket: 'vanmathi.firebasestorage.app',
  messagingSenderId: '466703829891',
  appId: '1:466703829891:web:e190086b69a1840dcec4b6',
  measurementId: 'G-6Z802G6SVT'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const data = payload.data || {};

  const title =
    n.title ||
    data.title ||
    'Nova pintura disponível';

  const body =
    n.body ||
    data.body ||
    'Uma nova peça foi liberada para pintura.';

  const link =
    data.link ||
    n.click_action ||
    'https://calalogameplay-creator.github.io/';

  self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.vendaId
      ? 'vanmathi-pintura-' + data.vendaId
      : 'vanmathi-pintura',
    data: {
      link: link
    }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url =
    event.notification?.data?.link ||
    'https://calalogameplay-creator.github.io/';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then((list) => {
        for (const client of list) {
          if ('focus' in client) {
            if ('navigate' in client) {
              client.navigate(url);
            }

            return client.focus();
          }
        }

        return clients.openWindow(url);
      })
  );
});
