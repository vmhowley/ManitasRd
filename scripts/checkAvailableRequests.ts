import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

console.log('🔧 Environment variables loaded');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'Set' : 'Not set');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set');

// Import Firebase services after environment variables are loaded
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../src/services/firebaseConfig';

async function checkAvailableRequests() {
  try {
    console.log('\n📋 Checking Service Requests...');
    
    // Check all service requests
    const serviceRequestsRef = collection(db, 'serviceRequests');
    const allServiceRequests = await getDocs(serviceRequestsRef);
    console.log(`Total service requests: ${allServiceRequests.size}`);
    
    allServiceRequests.forEach((doc) => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}, Status: ${data.status}, Category: ${data.category}, TechnicianId: ${data.technicianId || 'None'}`);
    });
    
    // Check pending service requests
    const pendingServiceQuery = query(
      collection(db, 'serviceRequests'),
      where('status', '==', 'pending')
    );
    const pendingServiceRequests = await getDocs(pendingServiceQuery);
    console.log(`\nPending service requests: ${pendingServiceRequests.size}`);
    
    console.log('\n📝 Checking Quote Requests...');
    
    // Check all quote requests
    const quoteRequestsRef = collection(db, 'quoteRequests');
    const allQuoteRequests = await getDocs(quoteRequestsRef);
    console.log(`Total quote requests: ${allQuoteRequests.size}`);
    
    allQuoteRequests.forEach((doc) => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}, Status: ${data.status}, Category: ${data.category}, Client: ${data.clientId}`);
    });
    
    // Check pending/quoted quote requests
    const availableQuoteQuery = query(
      collection(db, 'quoteRequests'),
      where('status', 'in', ['pending', 'quoted'])
    );
    const availableQuoteRequests = await getDocs(availableQuoteQuery);
    console.log(`\nAvailable quote requests (pending/quoted): ${availableQuoteRequests.size}`);
    
    console.log('\n👥 Checking Users...');
    
    // Check technicians
    const usersRef = collection(db, 'users');
    const technicianQuery = query(
      collection(db, 'users'),
      where('type', '==', 'technician')
    );
    const technicians = await getDocs(technicianQuery);
    console.log(`Total technicians: ${technicians.size}`);
    
    technicians.forEach((doc) => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}, Email: ${data.email}, Specialties: ${JSON.stringify(data.specialties || [])}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking available requests:', error);
  }
}

checkAvailableRequests();