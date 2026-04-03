import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let messagingRef: ReturnType<typeof getMessaging> | null = null;

export async function setupFcm(): Promise<string | null> {
  if (!(await isSupported())) return null;
  if (!('Notification' in window)) return null;

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
  }
  if (Notification.permission !== 'granted') return null;

  messagingRef = getMessaging(app);
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) return null;

  return getToken(messagingRef, { vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.ready });
}

export async function attachForegroundMessageListener(onPayload: (payload: unknown) => void): Promise<(() => void) | null> {
  if (!(await isSupported())) return null;
  if (!messagingRef) messagingRef = getMessaging(app);
  return onMessage(messagingRef, onPayload);
}

export async function sendPushByApi(userId: string, title: string, body: string, data?: Record<string, string>) {
  const endpoint = import.meta.env.VITE_PUSH_API_URL;
  if (!endpoint) return;

  await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, title, body, data }),
  });
}

export default app;
