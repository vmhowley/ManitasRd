import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, doc, setDoc, getDoc } from 'firebase/firestore';

dotenv.config();

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
});

const auth = getAuth(app);
const db = getFirestore(app);

async function createAuthUser() {
  try {
    console.log('=== CREATING FIREBASE AUTH USER ===');
    
    const email = 'vistor@gmail.com';
    const password = 'password123';
    const targetUserId = 'VFWcp7vk5MTGduTn5arSStfS7N63';
    
    // Verificar si el usuario ya existe en Firestore
    console.log('\n1. Checking if user exists in Firestore...');
    const userDoc = await getDoc(doc(db, 'users', targetUserId));
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found in Firestore');
      return;
    }
    
    const userData = userDoc.data();
    console.log('✅ User found in Firestore:', userData.email);
    
    // Intentar crear usuario en Firebase Auth
    console.log('\n2. Creating Firebase Auth user...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase Auth user created successfully!');
      console.log('Auth UID:', userCredential.user.uid);
      console.log('Expected UID:', targetUserId);
      
      if (userCredential.user.uid !== targetUserId) {
        console.log('⚠️ Warning: Auth UID does not match expected UID');
        console.log('This is normal for new Firebase Auth users');
        
        // Actualizar el documento de Firestore con el nuevo UID
        console.log('\n3. Updating Firestore document with new UID...');
        const newUserData = {
          ...userData,
          uid: userCredential.user.uid,
          _id: userCredential.user.uid
        };
        
        // Crear nuevo documento con el UID correcto
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
        console.log('✅ User document updated with correct UID');
        
        // Actualizar las solicitudes de servicio con el nuevo clientId
        console.log('\n4. Updating service requests with new clientId...');
        const requestsQuery = query(
          collection(db, 'serviceRequests'), 
          where('clientId', '==', targetUserId)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        
        console.log('Found', requestsSnapshot.size, 'requests to update');
        
        const updatePromises = [];
        requestsSnapshot.forEach((requestDoc) => {
          const updatePromise = setDoc(doc(db, 'serviceRequests', requestDoc.id), {
            ...requestDoc.data(),
            clientId: userCredential.user.uid
          });
          updatePromises.push(updatePromise);
        });
        
        await Promise.all(updatePromises);
        console.log('✅ Service requests updated with new clientId');
      }
      
    } catch (authError) {
      if (authError.code === 'auth/email-already-in-use') {
        console.log('✅ User already exists in Firebase Auth, attempting login...');
        
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('✅ Login successful!');
          console.log('Auth UID:', userCredential.user.uid);
          console.log('Email:', userCredential.user.email);
          
          // Verificar que el usuario tenga solicitudes
          const requestsQuery = query(
            collection(db, 'serviceRequests'), 
            where('clientId', '==', userCredential.user.uid)
          );
          const requestsSnapshot = await getDocs(requestsQuery);
          console.log('Service requests for this user:', requestsSnapshot.size);
          
        } catch (loginError) {
          console.error('❌ Login failed:', loginError.message);
        }
      } else {
        console.error('❌ Auth error:', authError.message);
      }
    }
    
    console.log('\n=== AUTH USER CREATION COMPLETE ===');
    
  } catch (error) {
    console.error('Error during auth user creation:', error);
  }
}

createAuthUser();