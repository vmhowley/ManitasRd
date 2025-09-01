import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkServices() {
  try {
    console.log('Checking services collection...');
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    
    if (servicesSnapshot.empty) {
      console.log('No services found in the database.');
    } else {
      console.log(`Found ${servicesSnapshot.size} services:`);
      servicesSnapshot.forEach(doc => {
        const data = doc.data();
        console.log('Service ID:', doc.id);
        console.log('Name:', data.name);
        console.log('Category:', data.category);
        console.log('Price:', data.price);
        console.log('IsActive:', data.isActive);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error checking services:', error);
  }
}

checkServices();