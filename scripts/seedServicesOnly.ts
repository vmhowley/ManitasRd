import 'dotenv/config';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '../src/services/firebaseConfigSeed';

// Datos de servicios (mismos que en firebaseSeed.ts)
const services = [
  // Plomería
  { name: 'Reparación de tuberías', description: 'Reparación de tuberías rotas o con fugas', category: 'Plomería', basePrice: 1500 },
  { name: 'Instalación de grifos', description: 'Instalación de grifos nuevos en cocina y baño', category: 'Plomería', basePrice: 800 },
  { name: 'Destape de drenajes', description: 'Limpieza y destape de drenajes obstruidos', category: 'Plomería', basePrice: 600 },
  { name: 'Reparación de inodoros', description: 'Reparación de inodoros que no funcionan correctamente', category: 'Plomería', basePrice: 900 },
  { name: 'Instalación de calentadores', description: 'Instalación de calentadores de agua eléctricos o de gas', category: 'Plomería', basePrice: 2500 },
  
  // Electricidad
  { name: 'Instalación de tomacorrientes', description: 'Instalación de nuevos tomacorrientes en el hogar', category: 'Electricidad', basePrice: 500 },
  { name: 'Reparación de interruptores', description: 'Reparación de interruptores de luz defectuosos', category: 'Electricidad', basePrice: 400 },
  { name: 'Instalación de ventiladores de techo', description: 'Instalación completa de ventiladores de techo', category: 'Electricidad', basePrice: 1200 },
  { name: 'Revisión de tablero eléctrico', description: 'Inspección y mantenimiento del tablero eléctrico principal', category: 'Electricidad', basePrice: 1800 },
  { name: 'Instalación de lámparas', description: 'Instalación de lámparas y sistemas de iluminación', category: 'Electricidad', basePrice: 700 },
  
  // Pintura
  { name: 'Pintura de interiores', description: 'Pintura completa de habitaciones interiores', category: 'Pintura', basePrice: 2000 },
  { name: 'Pintura de exteriores', description: 'Pintura de fachadas y paredes exteriores', category: 'Pintura', basePrice: 3000 },
  { name: 'Pintura de techos', description: 'Pintura especializada de techos y cielos rasos', category: 'Pintura', basePrice: 1500 },
  { name: 'Retoque de pintura', description: 'Retoques menores en paredes y superficies pintadas', category: 'Pintura', basePrice: 500 },
  { name: 'Preparación de superficies', description: 'Lijado y preparación de superficies para pintar', category: 'Pintura', basePrice: 800 },
  
  // Limpieza
  { name: 'Limpieza profunda de hogar', description: 'Limpieza completa y profunda de toda la casa', category: 'Limpieza', basePrice: 1200 },
  { name: 'Limpieza de alfombras', description: 'Limpieza especializada de alfombras y tapetes', category: 'Limpieza', basePrice: 800 },
  { name: 'Limpieza de ventanas', description: 'Limpieza de ventanas interiores y exteriores', category: 'Limpieza', basePrice: 600 },
  { name: 'Limpieza post-construcción', description: 'Limpieza especializada después de obras de construcción', category: 'Limpieza', basePrice: 2000 },
  { name: 'Limpieza de oficinas', description: 'Servicio de limpieza para espacios de oficina', category: 'Limpieza', basePrice: 1000 },
  
  // Carpintería
  { name: 'Reparación de puertas', description: 'Reparación de puertas de madera dañadas', category: 'Carpintería', basePrice: 1000 },
  { name: 'Instalación de estantes', description: 'Instalación de estantes y repisas de madera', category: 'Carpintería', basePrice: 800 },
  { name: 'Fabricación de muebles', description: 'Diseño y fabricación de muebles a medida', category: 'Carpintería', basePrice: 5000 },
  { name: 'Reparación de ventanas', description: 'Reparación de marcos y estructuras de ventanas de madera', category: 'Carpintería', basePrice: 1200 },
  { name: 'Instalación de closets', description: 'Diseño e instalación de closets empotrados', category: 'Carpintería', basePrice: 8000 },
  
  // Automotriz
  { name: 'Cambio de aceite', description: 'Cambio de aceite y filtro del motor', category: 'Automotriz', basePrice: 800 },
  { name: 'Reparación de frenos', description: 'Reparación y mantenimiento del sistema de frenos', category: 'Automotriz', basePrice: 2000 },
  { name: 'Alineación y balanceo', description: 'Servicio de alineación y balanceo de llantas', category: 'Automotriz', basePrice: 1200 },
  { name: 'Diagnóstico automotriz', description: 'Diagnóstico completo del vehículo con scanner', category: 'Automotriz', basePrice: 600 },
  { name: 'Cambio de batería', description: 'Reemplazo de batería automotriz', category: 'Automotriz', basePrice: 1500 }
];

// Función para agregar servicios
async function seedServices() {
  console.log('🌱 Agregando servicios a Firebase...');
  
  try {
    const batch = writeBatch(db);
    const servicesRef = collection(db, 'services');
    
    services.forEach((service) => {
      const docRef = doc(servicesRef);
      batch.set(docRef, {
        ...service,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
    });
    
    await batch.commit();
    console.log(`✅ ${services.length} servicios agregados exitosamente`);
    
  } catch (error) {
    console.error('❌ Error agregando servicios:', error);
    throw error;
  }
}

// Ejecutar
seedServices()
  .then(() => {
    console.log('\n🎉 Seeding de servicios completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error en el seeding:', error);
    process.exit(1);
  });