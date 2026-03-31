import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, logEvent as fbLogEvent } from "firebase/analytics";
import { getMessaging, getToken as fbGetToken, onMessage, isSupported as isMessagingSupported } from "firebase/messaging";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// ✅ Firebase Project: Line Free India
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
// Initialize App Check (Replace 'YOUR_RECAPTCHA_V3_SITE_KEY' with actual key when deploying)
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_APP_CHECK_SITE_KEY || 'dummy_key'),
  isTokenAutoRefreshEnabled: true
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export default app;

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const logEvent = (eventName: string, eventParams?: any) => {
  if (analytics) {
    try { fbLogEvent(analytics, eventName, eventParams); } catch (e) { console.error('Analytics error:', e); }
  }
};


let messaging: any = null;
if (typeof window !== 'undefined') {
  isMessagingSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  }).catch(() => {});
}
export { messaging };
export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await fbGetToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
      return token;
    }
  } catch (e) {
    console.error('FCM permission error:', e);
  }
  return null;
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => resolve(payload));
    }
  });
