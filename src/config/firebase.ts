import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjj4EVX4fZ85sn2VOfGWg-6kO4VQCDySo",
  authDomain: "ai-call-platform.firebaseapp.com",
  projectId: "ai-call-platform",
  storageBucket: "ai-call-platform.firebasestorage.app",
  messagingSenderId: "131302008676",
  appId: "1:131302008676:web:51bb47fee53287636e3c71",
  measurementId: "G-4QG8HZ6KGT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);