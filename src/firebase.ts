import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Firebase Project: Line Free India
const firebaseConfig = {
  apiKey: "AIzaSyBvIUSBHoQnAvfLrTsLUhSQ-DukjN1OsaQ",
  authDomain: "line-free-india.firebaseapp.com",
  projectId: "line-free-india",
  storageBucket: "line-free-india.firebasestorage.app",
  messagingSenderId: "848717293503",
  appId: "1:848717293503:web:3a5e525a689cd64b83230a",
  measurementId: "G-GZ0B8S4HKZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export default app;
