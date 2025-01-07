import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, getDocs } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const getFirebaseConfig = () => ({
  apiKey: localStorage.getItem('FIREBASE_API_KEY') || '',
  authDomain: localStorage.getItem('FIREBASE_AUTH_DOMAIN') || '',
  projectId: localStorage.getItem('FIREBASE_PROJECT_ID') || '',
  storageBucket: localStorage.getItem('FIREBASE_STORAGE_BUCKET') || '',
  messagingSenderId: localStorage.getItem('FIREBASE_MESSAGING_SENDER_ID') || '',
  appId: localStorage.getItem('FIREBASE_APP_ID') || '',
});

const initializeFirebase = () => {
  const config = getFirebaseConfig();
  
  // Check if we have all required config values
  if (!config.apiKey || !config.authDomain || !config.projectId) {
    console.error('Firebase configuration is incomplete');
    return false;
  }

  try {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Test database connection
    testDatabaseConnection();
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

// Function to test database connection
const testDatabaseConnection = async () => {
  if (!db) {
    console.error('Firestore not initialized');
    return;
  }

  try {
    // Try to access a test collection
    const testCollection = collection(db, '_test_connection');
    await getDocs(testCollection);
    console.log('Successfully connected to Firestore');
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
};

// Initialize if we have config
initializeFirebase();

// Export functions to get services
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;

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
  
  if (initializeFirebase()) {
    console.log('Firebase reinitialized successfully');
    window.location.reload();
  }
};