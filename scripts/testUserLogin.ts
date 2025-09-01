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

async function testUserLogin() {
  try {
    // Buscar el usuario vistor@gmail.com
    console.log('Buscando usuario vistor@gmail.com...');
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', 'vistor@gmail.com')
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.empty) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    
    console.log('✅ Usuario encontrado:');
    console.log('  ID:', userId);
    console.log('  Nombre:', userData.name);
    console.log('  Email:', userData.email);
    console.log('  Tipo:', userData.type);
    
    // Buscar solicitudes de este usuario
    console.log('\n🔍 Buscando solicitudes para este usuario...');
    const requestsQuery = query(
      collection(db, 'serviceRequests'),
      where('clientId', '==', userId)
    );
    
    const requestsSnapshot = await getDocs(requestsQuery);
    
    console.log(`📊 Solicitudes encontradas: ${requestsSnapshot.size}`);
    
    if (requestsSnapshot.size > 0) {
      console.log('\n📋 Detalles de las solicitudes:');
      requestsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  - ID: ${doc.id}`);
        console.log(`    Categoría: ${data.category}`);
        console.log(`    Descripción: ${data.description}`);
        console.log(`    Estado: ${data.status}`);
        console.log(`    Cliente ID: ${data.clientId}`);
        console.log(`    Fecha: ${data.createdAt?.toDate?.() || data.createdAt}`);
        console.log('    ---');
      });
      
      // Filtrar solicitudes activas
      const activeRequests = [];
      requestsSnapshot.forEach(doc => {
        const data = doc.data();
        if (['pending', 'assigned', 'in-process', 'in_progress'].includes(data.status)) {
          activeRequests.push(data);
        }
      });
      
      console.log(`\n✅ Solicitudes activas que deberían aparecer: ${activeRequests.length}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUserLogin();