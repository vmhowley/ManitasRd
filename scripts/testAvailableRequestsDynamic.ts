import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

console.log('🔧 Environment variables loaded');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'Set' : 'Not set');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set');

async function testAvailableRequests() {
  try {
    console.log('\n🔐 Testing login with technician credentials...');
    
    // Dynamic imports after environment variables are loaded
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { db, auth } = await import('../src/services/firebaseConfig');
    const { serviceRequestService } = await import('../src/services/serviceRequestService');
    const { quoteRequestService } = await import('../src/services/quoteRequestService');
    
    // Try to login with the technician (using seeded credentials)
    const userCredential = await signInWithEmailAndPassword(auth, 'tecnico1@test.com', 'password123');
    const user = userCredential.user;
    console.log('✅ Login successful!');
    console.log('User ID:', user.uid);
    console.log('User Email:', user.email);
    
    // Get user data from Firestore
    console.log('\n👤 Getting user data from Firestore...');
    const userQuery = query(
      collection(db, 'users'),
      where('email', '==', 'tecnico1@test.com')
    );
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      console.log('❌ No user found in Firestore with email tecnico1@test.com');
      return;
    }
    
    const userData = userSnapshot.docs[0].data();
    console.log('User data:', {
      id: userSnapshot.docs[0].id,
      email: userData.email,
      type: userData.type,
      specialties: userData.specialties
    });
    
    // Test serviceRequestService.getAvailableRequests()
    console.log('\n🔧 Testing serviceRequestService.getAvailableRequests()...');
    try {
      const availableServiceRequests = await serviceRequestService.getAvailableRequests();
      console.log(`Found ${availableServiceRequests.length} available service requests`);
      
      availableServiceRequests.forEach((req, index) => {
        console.log(`${index + 1}. ID: ${req._id}, Category: ${req.category}, Status: ${req.status}, TechnicianId: ${req.technicianId || 'None'}`);
      });
      
      // Filter by user specialties
      const filteredServiceRequests = availableServiceRequests.filter((req) => {
        const isPending = req.status === 'pending';
        const isNotAssigned = !req.technicianId;
        const hasMatchingSpecialty = userData.specialties?.some((specialty: string) =>
          req.category.toLowerCase().includes(specialty.toLowerCase()) ||
          specialty.toLowerCase().includes(req.category.toLowerCase())
        );
        console.log(`Request ${req._id}: isPending=${isPending}, isNotAssigned=${isNotAssigned}, hasMatchingSpecialty=${hasMatchingSpecialty}`);
        return isPending && isNotAssigned && hasMatchingSpecialty;
      });
      
      console.log(`\nAfter filtering by specialties: ${filteredServiceRequests.length} requests`);
      filteredServiceRequests.forEach((req, index) => {
        console.log(`${index + 1}. ID: ${req._id}, Category: ${req.category}`);
      });
      
    } catch (error) {
      console.error('❌ Error in serviceRequestService.getAvailableRequests():', error);
    }
    
    // Test quoteRequestService.getQuoteRequests()
    console.log('\n📝 Testing quoteRequestService.getQuoteRequests()...');
    try {
      const allQuoteRequests = await quoteRequestService.getQuoteRequests();
      console.log(`Found ${allQuoteRequests.length} quote requests`);
      
      allQuoteRequests.forEach((req, index) => {
        console.log(`${index + 1}. ID: ${req._id}, Category: ${req.category}, Status: ${req.status}, Client: ${req.clientId}`);
      });
      
      // Filter by status and specialties
      const availableQuoteRequests = allQuoteRequests.filter((req) => {
        const isPendingOrQuoted = ['pending', 'quoted'].includes(req.status);
        const hasMatchingSpecialty = userData.specialties?.some((specialty: string) =>
          req.category.toLowerCase().includes(specialty.toLowerCase()) ||
          specialty.toLowerCase().includes(req.category.toLowerCase())
        );
        console.log(`Quote ${req._id}: isPendingOrQuoted=${isPendingOrQuoted}, hasMatchingSpecialty=${hasMatchingSpecialty}`);
        return isPendingOrQuoted && hasMatchingSpecialty;
      });
      
      console.log(`\nAfter filtering by status and specialties: ${availableQuoteRequests.length} requests`);
      availableQuoteRequests.forEach((req, index) => {
        console.log(`${index + 1}. ID: ${req._id}, Category: ${req.category}`);
      });
      
    } catch (error) {
      console.error('❌ Error in quoteRequestService.getQuoteRequests():', error);
    }
    
    // Sign out
    await auth.signOut();
    console.log('\n🚪 Signed out successfully');
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

testAvailableRequests();