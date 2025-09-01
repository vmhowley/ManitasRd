import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const services = [
  // Plomería
  {
    name: 'Instalación de Inodoro',
    category: 'Plomería',
    description: 'Instalación completa de un inodoro estándar. No incluye el costo del inodoro.',
    basePrice: 2500,
  },
  {
    name: 'Reparación de Fuga de Grifo',
    category: 'Plomería',
    description: 'Diagnóstico y reparación de fugas en grifos de cocina o baño.',
    basePrice: 1200,
  },
  {
    name: 'Desatasco de Tuberías',
    category: 'Plomería',
    description: 'Eliminación de obstrucciones en tuberías de lavamanos, duchas o inodoros.',
    basePrice: 1800,
  },
  {
    name: 'Instalación de Calentador de Agua',
    category: 'Plomería',
    description: 'Instalación de calentador de agua eléctrico o de gas. No incluye el equipo.',
    basePrice: 3500,
  },
  {
    name: 'Reemplazo de Tuberías (sección)',
    category: 'Plomería',
    description: 'Reemplazo de una sección de tubería dañada (cobre, PVC, PEX).',
    basePrice: 4000,
  },
  {
    name: 'Instalación de Lavaplatos',
    category: 'Plomería',
    description: 'Instalación de un nuevo lavaplatos con conexión a desagüe y grifería.',
    basePrice: 2800,
  },
  {
    name: 'Reparación de Cisterna',
    category: 'Plomería',
    description: 'Reparación de mecanismos internos de cisterna de inodoro.',
    basePrice: 1000,
  },
  {
    name: 'Instalación de Ducha/Bañera',
    category: 'Plomería',
    description: 'Instalación de nueva ducha o bañera. No incluye obra civil.',
    basePrice: 6000,
  },
  {
    name: 'Mantenimiento de Bombas de Agua',
    category: 'Plomería',
    description: 'Revisión y mantenimiento preventivo de bombas de agua residenciales.',
    basePrice: 2500,
  },
  {
    name: 'Detección de Fugas (no destructiva)',
    category: 'Plomería',
    description: 'Uso de tecnología para detectar fugas sin romper paredes o suelos.',
    basePrice: 3000,
  },

  // Electricidad
  {
    name: 'Instalación de Tomacorriente',
    category: 'Electricidad',
    description: 'Instalación de un nuevo punto de tomacorriente. Incluye cableado básico.',
    basePrice: 1500,
    priceModifiers: [
      { name: 'Punto doble', additionalCost: 300 },
      { name: 'Cableado complejo (>5m)', additionalCost: 500 },
    ],
  },
  {
    name: 'Instalación de Abanico de Techo',
    category: 'Electricidad',
    description: 'Ensamblaje e instalación de un abanico de techo en un punto de luz existente.',
    basePrice: 2200,
  },
  {
    name: 'Reemplazo de Interruptor de Luz',
    category: 'Electricidad',
    description: 'Reemplazo de interruptor de luz simple o doble.',
    basePrice: 1000,
  },
  {
    name: 'Revisión de Panel Eléctrico',
    category: 'Electricidad',
    description: 'Inspección y diagnóstico de problemas en el panel eléctrico principal.',
    basePrice: 2500,
  },
  {
    name: 'Instalación de Lámparas/Focos',
    category: 'Electricidad',
    description: 'Instalación de luminarias de techo o pared.',
    basePrice: 1200,
  },
  {
    name: 'Cableado de Red (Ethernet)',
    category: 'Electricidad',
    description: 'Instalación de puntos de red cableada para internet.',
    basePrice: 1500,
  },
  {
    name: 'Instalación de Timbre',
    category: 'Electricidad',
    description: 'Instalación o reemplazo de timbre eléctrico.',
    basePrice: 900,
  },
  {
    name: 'Reparación de Cortocircuito',
    category: 'Electricidad',
    description: 'Localización y reparación de cortocircuitos en la instalación eléctrica.',
    basePrice: 3000,
  },

  // Pintura
  {
    name: 'Pintura de Habitación (por m²)',
    category: 'Pintura',
    description: 'Aplicación de dos capas de pintura en paredes. No incluye la pintura.',
    basePrice: 250,
  },
  {
    name: 'Pintura de Techo (por m²)',
    category: 'Pintura',
    description: 'Aplicación de dos capas de pintura en techos. No incluye la pintura.',
    basePrice: 300,
  },
  {
    name: 'Reparación de Paredes Menores',
    category: 'Pintura',
    description: 'Relleno de pequeños agujeros y grietas antes de pintar.',
    basePrice: 700,
  },
  {
    name: 'Pintura Exterior (por m²)',
    category: 'Pintura',
    description: 'Aplicación de pintura en fachadas y muros exteriores. No incluye la pintura.',
    basePrice: 350,
  },
  {
    name: 'Pintura de Puertas y Marcos',
    category: 'Pintura',
    description: 'Lijado y pintura de puertas y marcos de madera o metal.',
    basePrice: 800,
  },

  // Jardinería
  {
    name: 'Corte de Césped',
    category: 'Jardinería',
    description: 'Corte y recolección de césped en áreas residenciales.',
    basePrice: 1000,
    priceModifiers: [
      { name: 'Jardín grande (>100m²)', additionalCost: 500 },
      { name: 'Desmalezado', additionalCost: 300 },
    ],
  },
  {
    name: 'Poda de Arbustos',
    category: 'Jardinería',
    description: 'Poda y modelado de arbustos y setos.',
    basePrice: 1500,
  },
  {
    name: 'Mantenimiento de Jardín',
    category: 'Jardinería',
    description: 'Mantenimiento general de jardín incluyendo riego y fertilización.',
    basePrice: 2000,
  },

  // Limpieza
  {
    name: 'Limpieza General de Casa',
    category: 'Limpieza',
    description: 'Limpieza completa de casa incluyendo todas las habitaciones.',
    basePrice: 2500,
  },
  {
    name: 'Limpieza de Oficinas',
    category: 'Limpieza',
    description: 'Limpieza de espacios de oficina y áreas de trabajo.',
    basePrice: 1800,
  },
  {
    name: 'Limpieza Post-Construcción',
    category: 'Limpieza',
    description: 'Limpieza especializada después de trabajos de construcción o remodelación.',
    basePrice: 4000,
  },
  {
    name: 'Limpieza de Alfombras',
    category: 'Limpieza',
    description: 'Limpieza profunda de alfombras y tapetes.',
    basePrice: 1200,
  },

  // Carpintería
  {
    name: 'Reparación de Muebles de Madera',
    category: 'Carpintería',
    description: 'Reparación de sillas, mesas, armarios y otros muebles de madera.',
    basePrice: 1500,
  },
  {
    name: 'Instalación de Puertas',
    category: 'Carpintería',
    description: 'Instalación de puertas interiores o exteriores, incluyendo marcos y herrajes.',
    basePrice: 3000,
  },
  {
    name: 'Construcción de Estanterías a Medida',
    category: 'Carpintería',
    description: 'Diseño y construcción de estanterías personalizadas de madera.',
    basePrice: 2500,
  },
  {
    name: 'Reparación de Pisos de Madera',
    category: 'Carpintería',
    description: 'Reparación de tablas sueltas, rayadas o dañadas en pisos de madera.',
    basePrice: 1800,
  },

  // Automotriz
  {
    name: 'Cambio de Aceite y Filtro',
    category: 'Automotriz',
    description: 'Reemplazo de aceite de motor y filtro de aceite.',
    basePrice: 1500,
  },
  {
    name: 'Revisión de Frenos',
    category: 'Automotriz',
    description: 'Inspección de pastillas, discos y líquido de frenos.',
    basePrice: 1000,
  },
  {
    name: 'Cambio de Batería',
    category: 'Automotriz',
    description: 'Reemplazo e instalación de batería de auto. No incluye el costo de la batería.',
    basePrice: 800,
  },
  {
    name: 'Alineación y Balanceo',
    category: 'Automotriz',
    description: 'Ajuste de la dirección y balanceo de neumáticos para un desgaste uniforme.',
    basePrice: 2000,
  },
  {
    name: 'Diagnóstico de Motor (Check Engine)',
    category: 'Automotriz',
    description: 'Uso de escáner para diagnosticar códigos de error del motor.',
    basePrice: 2500,
  },
];

// Función para limpiar la colección de servicios
export const clearServices = async (): Promise<void> => {
  try {
    const servicesCollection = collection(db, 'services');
    const snapshot = await getDocs(servicesCollection);
    
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, 'services', docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
    console.log('✅ Servicios existentes eliminados');
  } catch (error) {
    console.error('❌ Error al limpiar servicios:', error);
    throw error;
  }
};

// Función para sembrar servicios en Firestore
export const seedServices = async (): Promise<void> => {
  try {
    const servicesCollection = collection(db, 'services');
    
    const addPromises = services.map(service => 
      addDoc(servicesCollection, {
        ...service,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      })
    );
    
    await Promise.all(addPromises);
    console.log(`✅ ${services.length} servicios agregados exitosamente`);
  } catch (error) {
    console.error('❌ Error al sembrar servicios:', error);
    throw error;
  }
};

// Función principal para ejecutar el seed
export const runSeed = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando proceso de seed...');
    
    // Limpiar servicios existentes
    await clearServices();
    
    // Agregar nuevos servicios
    await seedServices();
    
    console.log('🎉 Proceso de seed completado exitosamente');
  } catch (error) {
    console.error('💥 Error en el proceso de seed:', error);
    throw error;
  }
};

// Ejecutar seed si el archivo se ejecuta directamente
if (typeof window === 'undefined') {
  runSeed().catch(console.error);
}