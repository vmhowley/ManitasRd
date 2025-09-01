import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
const auth = getAuth(app);
const db = getFirestore(app);

async function debugClientDashboard() {
  try {
    console.log('=== DEBUGGING CLIENT DASHBOARD ===');
    
    // Sign in as the test user
    const userCredential = await signInWithEmailAndPassword(auth, 'vistor@gmail.com', 'password123');
    const user = userCredential.user;
    
    console.log('✅ User authenticated:', {
      uid: user.uid,
      email: user.email
    });
    
    // Get service requests without orderBy
    console.log('\n--- Fetching Service Requests ---');
    const serviceRequestsQuery = query(
      collection(db, 'serviceRequests'),
      where('clientId', '==', user.uid)
    );
    
    const serviceRequestsSnapshot = await getDocs(serviceRequestsQuery);
    const serviceRequests = serviceRequestsSnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${serviceRequests.length} service requests:`);
    serviceRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. ID: ${req._id}`);
      console.log(`     Client ID: ${req.clientId}`);
      console.log(`     Status: ${req.status}`);
      console.log(`     Category: ${req.category}`);
      console.log(`     Created: ${req.createdAt?.toDate?.() || req.createdAt}`);
    });
    
    // Filter active service requests
    const activeServiceRequests = serviceRequests.filter(req => {
      const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
      const userMatches = clientId === user.uid;
      const statusMatches = ['pending', 'assigned', 'in-process'].includes(req.status);
      
      console.log(`\n  Filtering ${req._id}:`);
      console.log(`    Client ID: ${clientId}`);
      console.log(`    User UID: ${user.uid}`);
      console.log(`    User matches: ${userMatches}`);
      console.log(`    Status: ${req.status}`);
      console.log(`    Status matches: ${statusMatches}`);
      console.log(`    Final match: ${userMatches && statusMatches}`);
      
      return userMatches && statusMatches;
    });
    
    console.log(`\n✅ Active Service Requests: ${activeServiceRequests.length}`);
    
    // Get quote requests without orderBy
    console.log('\n--- Fetching Quote Requests ---');
    const quoteRequestsQuery = query(
      collection(db, 'quoteRequests'),
      where('clientId', '==', user.uid)
    );
    
    const quoteRequestsSnapshot = await getDocs(quoteRequestsQuery);
    const quoteRequests = quoteRequestsSnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${quoteRequests.length} quote requests:`);
    quoteRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. ID: ${req._id}`);
      console.log(`     Client ID: ${req.clientId}`);
      console.log(`     Status: ${req.status}`);
      console.log(`     Description: ${req.description}`);
    });
    
    // Filter active quote requests
    const activeQuoteRequests = quoteRequests.filter(req => {
      const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
      const userMatches = clientId === user.uid;
      const statusMatches = ['pending', 'quoted', 'in_progress'].includes(req.status);
      
      return userMatches && statusMatches;
    });
    
    console.log(`\n✅ Active Quote Requests: ${activeQuoteRequests.length}`);
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total Service Requests: ${serviceRequests.length}`);
    console.log(`Active Service Requests: ${activeServiceRequests.length}`);
    console.log(`Total Quote Requests: ${quoteRequests.length}`);
    console.log(`Active Quote Requests: ${activeQuoteRequests.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugClientDashboard();