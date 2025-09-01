#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config(); // Carga .env
dotenv.config({ path: '.env.local' }); // Carga .env.local

console.log('🔧 Environment Variables loaded:');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'LOADED' : 'MISSING');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY ? 'LOADED' : 'MISSING');

console.log('\n🚀 Attempting to import firebaseConfig...');

try {
  const { db, auth } = await import('../src/services/firebaseConfig');
  console.log('✅ Firebase config imported successfully!');
  console.log('Database:', db ? 'INITIALIZED' : 'MISSING');
  console.log('Auth:', auth ? 'INITIALIZED' : 'MISSING');
} catch (error) {
  console.error('❌ Failed to import firebaseConfig:', error);
}