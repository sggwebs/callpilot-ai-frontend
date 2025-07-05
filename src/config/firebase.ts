import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-yhEYGYTH1ipYnF2dW7uZVZIBgj6KvQQ",
  authDomain: "callpilotai-afc9e.firebaseapp.com",
  projectId: "callpilotai-afc9e",
  storageBucket: "callpilotai-afc9e.firebasestorage.app",
  messagingSenderId: "771355880831",
  appId: "1:771355880831:web:28712cc265b2dc73137e4a",
  measurementId: "G-7EGQ12F5HT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);