#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config(); // Carga .env
dotenv.config({ path: '.env.local' }); // Carga .env.local

console.log('🔧 Environment Variables Test:');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY || 'MISSING');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY || 'MISSING');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'MISSING');
console.log('VITE_FIREBASE_PROJECT_ID:', process.env.VITE_FIREBASE_PROJECT_ID || 'MISSING');

// Test the getEnvVar function logic
const getEnvVar = (key: string): string => {
  const withoutPrefix = key.replace('VITE_', '');
  const value = process.env[withoutPrefix] || process.env[key] || '';
  console.log(`getEnvVar('${key}') -> trying '${withoutPrefix}' then '${key}' -> '${value}'`);
  return value;
};

console.log('\n🧪 Testing getEnvVar function:');
getEnvVar('VITE_FIREBASE_API_KEY');
getEnvVar('VITE_FIREBASE_PROJECT_ID');