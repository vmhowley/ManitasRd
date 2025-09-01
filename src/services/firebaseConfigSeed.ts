// Firebase configuration for seeding (Firestore only)
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Detectar si estamos en Node.js o en el navegador
const isNode = typeof window === 'undefined';

// Función para obtener variables de entorno
const getEnvVar = (key: string): string => {
  if (isNode) {
    // En Node.js, usar process.env
    return process.env[key] || '';
  } else {
    // En el navegador, usar import.meta.env
    return (import.meta.env as any)[key] || '';
  }
};

// Firebase config object - Uses environment variables
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore only
export const db = getFirestore(app);

// For development - connect to Firestore emulator if enabled
const useEmulator = getEnvVar('VITE_FIREBASE_USE_EMULATOR') === 'true';
const isDev = isNode ? process.env.NODE_ENV !== 'production' : (import.meta.env as any).DEV;

if (useEmulator && isDev) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (error) {
    console.log('Firestore emulator connection failed:', error);
  }
}

// Export app instance
export default app;