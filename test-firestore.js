// Simple test script to add test users to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test users
const testUsers = [
  {
    id: 'user1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    userType: 'client'
  },
  {
    id: 'user2', 
    name: 'María García',
    email: 'maria@example.com',
    userType: 'technician'
  }
];

// Test message
const testMessage = {
  senderId: 'user1',
  receiverId: 'user2',
  content: 'Hola, necesito ayuda con mi plomería',
  chatId: 'user1_user2',
  senderName: 'Juan Pérez',
  receiverName: 'María García',
  timestamp: new Date()
};

async function addTestData() {
  try {
    // Add test users
    for (const user of testUsers) {
      await setDoc(doc(db, 'users', user.id), user);
      console.log(`Added user: ${user.name}`);
    }
    
    // Add test message
    await addDoc(collection(db, 'messages'), testMessage);
    console.log('Added test message');
    
    console.log('Test data added successfully!');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

addTestData();