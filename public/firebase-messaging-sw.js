/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js');

const url = new URL(self.location.href);
const config = {
  apiKey: url.searchParams.get('apiKey') || '',
  authDomain: url.searchParams.get('authDomain') || '',
  projectId: url.searchParams.get('projectId') || '',
  storageBucket: url.searchParams.get('storageBucket') || '',
  messagingSenderId: url.searchParams.get('messagingSenderId') || '',
  appId: url.searchParams.get('appId') || '',
};

const hasConfig = Object.values(config).every(Boolean);
if (hasConfig) {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload?.notification?.title || 'Line Free India';
    const options = {
      body: payload?.notification?.body || 'You have a new queue update.',
      icon: '/vite.svg',
      data: payload?.data || {},
    };
    self.registration.showNotification(title, options);
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/customer/tokens'));
});
