import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkUserRequests() {
  try {
    console.log('Checking all serviceRequests...');
    const allRequestsSnapshot = await getDocs(collection(db, 'serviceRequests'));
    
    console.log(`Total serviceRequests in database: ${allRequestsSnapshot.size}`);
    
    if (allRequestsSnapshot.size > 0) {
      console.log('\nAll requests:');
      allRequestsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`Client ID: ${data.clientId}`);
        console.log(`Status: ${data.status}`);
        console.log(`Category: ${data.category}`);
        console.log(`Description: ${data.description}`);
        console.log(`Created: ${data.createdAt?.toDate?.() || data.createdAt}`);
        console.log('---');
      });
    }
    
    // Check users collection to see current users
    console.log('\nChecking users...');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`Total users: ${usersSnapshot.size}`);
    
    if (usersSnapshot.size > 0) {
      console.log('\nUsers:');
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`User ID: ${doc.id}`);
        console.log(`Name: ${data.name}`);
        console.log(`Email: ${data.email}`);
        console.log(`Type: ${data.type}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('Error checking requests:', error);
  }
}

checkUserRequests();