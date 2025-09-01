import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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

async function fixClientId() {
  try {
    console.log('Buscando solicitudes sin clientId...');
    const allRequestsSnapshot = await getDocs(collection(db, 'serviceRequests'));
    
    let fixed = 0;
    
    for (const docSnapshot of allRequestsSnapshot.docs) {
      const data = docSnapshot.data();
      
      if (!data.clientId || data.clientId === undefined) {
        console.log(`Solicitud sin clientId encontrada: ${docSnapshot.id}`);
        console.log(`Descripción: ${data.description}`);
        
        // Asignar a un cliente existente (vistor mangue)
        const clientId = 'VFWcp7vk5MTGduTn5arSStfS7N63';
        
        await updateDoc(doc(db, 'serviceRequests', docSnapshot.id), {
          clientId: clientId
        });
        
        console.log(`ClientId actualizado para solicitud ${docSnapshot.id}`);
        fixed++;
      }
    }
    
    console.log(`\nSolicitudes corregidas: ${fixed}`);
    
    // Verificar el resultado
    console.log('\nVerificando solicitudes después de la corrección...');
    const updatedSnapshot = await getDocs(collection(db, 'serviceRequests'));
    
    updatedSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id} - ClientId: ${data.clientId} - Status: ${data.status}`);
    });
    
  } catch (error) {
    console.error('Error fixing clientId:', error);
  }
}

fixClientId();