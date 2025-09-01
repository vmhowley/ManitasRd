import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
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

// Simular la función getRequests del serviceRequestService
async function getRequests(userId: string) {
  try {
    console.log('🔍 Simulando serviceRequestService.getRequests para userId:', userId);
    
    // Temporarily remove orderBy to avoid index requirement
    const q = query(
      collection(db, 'serviceRequests'),
      where('clientId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const requests: any[] = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        ...doc.data(),
        _id: doc.id
      });
    });
    
    // Sort manually by createdAt
    requests.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return bTime.getTime() - aTime.getTime();
    });
    
    console.log('📋 Requests obtenidos:', requests.length);
    requests.forEach((req, index) => {
      console.log(`  ${index + 1}. ID: ${req._id}`);
      console.log(`     Categoría: ${req.category}`);
      console.log(`     Estado: ${req.status}`);
      console.log(`     ClientId: ${req.clientId}`);
    });
    
    return requests;
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    throw error;
  }
}

// Simular el filtro del ClientDashboard
function filterActiveServiceRequests(serviceRequests: any[], userUid: string) {
  console.log('\n🔍 Simulando filtro de solicitudes activas...');
  console.log('User UID:', userUid);
  console.log('Total requests to filter:', serviceRequests.length);
  
  const activeServiceRequests = serviceRequests.filter((req) => {
    // Handle both string clientId and object clientId
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    const userMatches = userUid && clientId === userUid;
    const statusMatches = ['pending', 'assigned', 'in-process', 'in_progress'].includes(req.status);
    const matches = userMatches && statusMatches;

    console.log('🔍 Filtering request:', {
      requestId: req._id,
      clientId: req.clientId,
      extractedClientId: clientId,
      userUid: userUid,
      userMatches,
      status: req.status,
      statusMatches,
      willInclude: matches
    });

    return matches;
  });
  
  console.log('📊 Active service requests after filtering:', activeServiceRequests.length);
  return activeServiceRequests;
}

async function simulateClientDashboard() {
  try {
    const userId = 'VFWcp7vk5MTGduTn5arSStfS7N63'; // vistor@gmail.com
    
    console.log('🎯 Simulando ClientDashboard para usuario:', userId);
    
    // Paso 1: Obtener solicitudes
    const serviceRequests = await getRequests(userId);
    
    // Paso 2: Filtrar solicitudes activas
    const activeRequests = filterActiveServiceRequests(serviceRequests, userId);
    
    console.log('\n✅ Resultado final:');
    console.log(`   - Total solicitudes obtenidas: ${serviceRequests.length}`);
    console.log(`   - Solicitudes activas filtradas: ${activeRequests.length}`);
    
    if (activeRequests.length > 0) {
      console.log('\n📋 Solicitudes que deberían aparecer en el dashboard:');
      activeRequests.forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.category} - ${req.description} (${req.status})`);
      });
    } else {
      console.log('\n❌ No hay solicitudes activas para mostrar');
    }
    
  } catch (error) {
    console.error('❌ Error en simulación:', error);
  }
}

simulateClientDashboard();