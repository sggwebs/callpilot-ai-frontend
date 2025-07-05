import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAnZ293DVoCT2otLdoVVkhWGQUNbyCbgto",
  authDomain: "metaverseai-app.firebaseapp.com",
  projectId: "metaverseai-app",
  storageBucket: "metaverseai-app.firebasestorage.app",
  messagingSenderId: "126067997258",
  appId: "1:126067997258:web:98c9615fc81d69bbf004b3",
  measurementId: "G-MH5YP3HLK8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);