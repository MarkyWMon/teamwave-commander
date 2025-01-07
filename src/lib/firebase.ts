import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: localStorage.getItem('FIREBASE_API_KEY') || '',
  authDomain: localStorage.getItem('FIREBASE_AUTH_DOMAIN') || '',
  projectId: localStorage.getItem('FIREBASE_PROJECT_ID') || '',
  storageBucket: localStorage.getItem('FIREBASE_STORAGE_BUCKET') || '',
  messagingSenderId: localStorage.getItem('FIREBASE_MESSAGING_SENDER_ID') || '',
  appId: localStorage.getItem('FIREBASE_APP_ID') || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to set Firebase config
export const setFirebaseConfig = (config: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}) => {
  localStorage.setItem('FIREBASE_API_KEY', config.apiKey);
  localStorage.setItem('FIREBASE_AUTH_DOMAIN', config.authDomain);
  localStorage.setItem('FIREBASE_PROJECT_ID', config.projectId);
  localStorage.setItem('FIREBASE_STORAGE_BUCKET', config.storageBucket);
  localStorage.setItem('FIREBASE_MESSAGING_SENDER_ID', config.messagingSenderId);
  localStorage.setItem('FIREBASE_APP_ID', config.appId);
  window.location.reload(); // Reload to reinitialize Firebase with new config
};