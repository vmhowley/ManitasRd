#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno ANTES de cualquier otra importación
dotenv.config(); // Carga .env
dotenv.config({ path: '.env.local' }); // Carga .env.local

// Debug: Verificar que las variables se cargaron
console.log('🔧 Environment Variables Check:');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'LOADED' : 'MISSING');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY ? 'LOADED' : 'MISSING');

/**
 * Script para ejecutar el seeding de Firebase desde línea de comandos
 * usando importación dinámica para evitar problemas con variables de entorno
 */

const args = process.argv.slice(2);
const command = args[0] || 'full';

async function main() {
  try {
    console.log('🚀 Iniciando script de seeding...');
    console.log(`📋 Comando: ${command}`);
    console.log('=' .repeat(50));

    // Importación dinámica DESPUÉS de cargar las variables de entorno
    const { SeedService } = await import('../src/services/seedService');

    switch (command) {
      case 'full':
        // Check existing data instead of seeding
        console.log('📊 Checking existing data...');
        const stats = await SeedService.getCollectionStats();
        console.log('Services:', stats.services);
        console.log('Users:', stats.users);
        
        // Check service requests and quote requests
        console.log('\n📋 Checking Service Requests...');
        const { collection, getDocs, query, where } = await import('firebase/firestore');
        const { db } = await import('../src/services/firebaseConfig');
        
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
        
        const quoteRequestsRef = collection(db, 'quoteRequests');
        const allQuoteRequests = await getDocs(quoteRequestsRef);
        console.log(`Total quote requests: ${allQuoteRequests.size}`);
        
        allQuoteRequests.forEach((doc) => {
          const data = doc.data();
          console.log(`- ID: ${doc.id}, Status: ${data.status}, Category: ${data.category}, Client: ${data.clientId}`);
        });
        
        // Check available quote requests
        const availableQuoteQuery = query(
          collection(db, 'quoteRequests'),
          where('status', 'in', ['pending', 'quoted'])
        );
        const availableQuoteRequests = await getDocs(availableQuoteQuery);
        console.log(`\nAvailable quote requests (pending/quoted): ${availableQuoteRequests.size}`);
        
        // Check technicians
        const technicianQuery = query(
          collection(db, 'users'),
          where('type', '==', 'technician')
        );
        const technicians = await getDocs(technicianQuery);
        console.log(`\nTotal technicians: ${technicians.size}`);
        
        technicians.forEach((doc) => {
          const data = doc.data();
          console.log(`- ID: ${doc.id}, Email: ${data.email}, Specialties: ${JSON.stringify(data.specialties || [])}`);
        });
        break;

      case 'services':
        console.log('🛠️ Creando solo servicios...');
        await SeedService.clearCollection('services');
        await SeedService.seedServices();
        break;

      case 'users':
        console.log('👥 Creando solo usuarios...');
        await SeedService.clearCollection('users');
        await SeedService.seedUsers();
        break;

      case 'clear':
        console.log('🧹 Limpiando todas las colecciones...');
        await SeedService.clearCollection('services');
        await SeedService.clearCollection('users');
        await SeedService.clearCollection('serviceRequests');
        await SeedService.clearCollection('messages');
        console.log('✅ Limpieza completada');
        break;

      case 'stats':
        console.log('📊 Mostrando estadísticas...');
        await SeedService.getCollectionStats();
        break;

      default:
        console.log('❌ Comando no reconocido. Comandos disponibles:');
        console.log('  - full (por defecto)');
        console.log('  - services');
        console.log('  - users');
        console.log('  - clear');
        console.log('  - stats');
        process.exit(1);
    }

    console.log('\n✅ Seeding completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  }
}

// Ejecutar el script
main();