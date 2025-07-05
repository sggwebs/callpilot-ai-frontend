import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBk3UO4jZHGCPUJoU0Rg5V9B4hOjGnRwZQ",
  authDomain: "callpilot-ai-n8jj2.firebaseapp.com",
  projectId: "callpilot-ai-n8jj2",
  storageBucket: "callpilot-ai-n8jj2.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);