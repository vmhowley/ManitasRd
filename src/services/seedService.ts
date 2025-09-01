import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import app from './firebaseConfig';

// Tipos para los datos de seed
interface SeedService {
  name: string;
  category: string;
  description: string;
  basePrice: number;
  priceModifiers?: Array<{
    name: string;
    additionalCost: number;
  }>;
}

interface SeedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'client' | 'technician';
  specialties?: string[];
  experience?: number;
  rating?: number;
  completedJobs?: number;
}

// Datos de servicios de ejemplo
const sampleServices: SeedService[] = [
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
    name: 'Pintura de Habitación (por m²)',
    category: 'Pintura',
    description: 'Aplicación de dos capas de pintura en paredes. No incluye la pintura.',
    basePrice: 250,
  },
  {
    name: 'Limpieza General de Casa',
    category: 'Limpieza',
    description: 'Limpieza completa de casa incluyendo todas las habitaciones.',
    basePrice: 2500,
  },
];

// Datos de usuarios de ejemplo
const sampleUsers: SeedUser[] = [
  {
    email: 'cliente1@test.com',
    password: 'password123',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+1234567890',
    userType: 'client',
  },
  {
    email: 'cliente2@test.com',
    password: 'password123',
    firstName: 'María',
    lastName: 'González',
    phone: '+1234567891',
    userType: 'client',
  },
  {
    email: 'tecnico1@test.com',
    password: 'password123',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    phone: '+1234567892',
    userType: 'technician',
    specialties: ['Plomería', 'Electricidad'],
    experience: 5,
    rating: 4.8,
    completedJobs: 150,
  },
  {
    email: 'tecnico2@test.com',
    password: 'password123',
    firstName: 'Ana',
    lastName: 'Martínez',
    phone: '+1234567893',
    userType: 'technician',
    specialties: ['Pintura', 'Limpieza'],
    experience: 3,
    rating: 4.6,
    completedJobs: 85,
  },
];

/**
 * Servicio para manejar operaciones de seeding en Firebase
 */
export class SeedService {
  /**
   * Limpia una colección específica
   */
  static async clearCollection(collectionName: string): Promise<void> {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`📭 Colección '${collectionName}' ya está vacía`);
        return;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach(docSnapshot => {
        batch.delete(doc(db, collectionName, docSnapshot.id));
      });
      
      await batch.commit();
      console.log(`🗑️ Colección '${collectionName}' limpiada (${snapshot.size} documentos eliminados)`);
    } catch (error) {
      console.error(`❌ Error al limpiar colección '${collectionName}':`, error);
      throw error;
    }
  }

  /**
   * Siembra servicios en Firestore
   */
  static async seedServices(services: SeedService[] = sampleServices): Promise<void> {
    try {
      const servicesCollection = collection(db, 'services');
      const batch = writeBatch(db);
      
      services.forEach(service => {
        const docRef = doc(servicesCollection);
        batch.set(docRef, {
          ...service,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        });
      });
      
      await batch.commit();
      console.log(`✅ ${services.length} servicios agregados exitosamente`);
    } catch (error) {
      console.error('❌ Error al sembrar servicios:', error);
      throw error;
    }
  }

  /**
   * Siembra usuarios de prueba
   */
  static async seedUsers(users: SeedUser[] = sampleUsers): Promise<void> {
    try {
      const usersCollection = collection(db, 'users');
      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          // Crear usuario en Firebase Auth
          const auth = getAuth(app);
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            user.email,
            user.password
          );

          // Crear documento de usuario en Firestore
          await addDoc(usersCollection, {
            uid: userCredential.user.uid,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            userType: user.userType,
            ...(user.userType === 'technician' && {
              specialties: user.specialties || [],
              experience: user.experience || 0,
              rating: user.rating || 0,
              completedJobs: user.completedJobs || 0,
              isVerified: true,
            }),
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
          });

          successCount++;
          console.log(`👤 Usuario creado: ${user.email}`);
        } catch (error: any) {
          errorCount++;
          if (error.code === 'auth/email-already-in-use') {
            console.log(`⚠️ Usuario ya existe: ${user.email}`);
          } else {
            console.error(`❌ Error creando usuario ${user.email}:`, error.message);
          }
        }
      }

      console.log(`✅ Usuarios procesados: ${successCount} exitosos, ${errorCount} errores`);
    } catch (error) {
      console.error('❌ Error general al sembrar usuarios:', error);
      throw error;
    }
  }

  /**
   * Ejecuta el proceso completo de seeding
   */
  static async runFullSeed(options: {
    clearExisting?: boolean;
    seedServices?: boolean;
    seedUsers?: boolean;
    customServices?: SeedService[];
    customUsers?: SeedUser[];
  } = {}): Promise<void> {
    const {
      clearExisting = true,
      seedServices = true,
      seedUsers = true,
      customServices,
      customUsers,
    } = options;

    try {
      console.log('🌱 Iniciando proceso completo de seeding...');

      if (clearExisting) {
        console.log('🧹 Limpiando datos existentes...');
        if (seedServices) await this.clearCollection('services');
        if (seedUsers) await this.clearCollection('users');
      }

      if (seedServices) {
        console.log('🔧 Sembrando servicios...');
        await this.seedServices(customServices);
      }

      if (seedUsers) {
        console.log('👥 Sembrando usuarios...');
        await this.seedUsers(customUsers);
      }

      console.log('🎉 Proceso de seeding completado exitosamente');
    } catch (error) {
      console.error('💥 Error en el proceso de seeding:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de las colecciones
   */
  static async getCollectionStats(): Promise<{
    services: number;
    users: number;
    serviceRequests: number;
    messages: number;
  }> {
    try {
      const collections = ['services', 'users', 'serviceRequests', 'messages'];
      const stats: any = {};

      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        stats[collectionName] = snapshot.size;
      }

      console.log('📊 Estadísticas de colecciones:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

// Funciones de conveniencia para uso directo
export const clearServices = () => SeedService.clearCollection('services');
export const clearUsers = () => SeedService.clearCollection('users');
export const seedServices = (services?: SeedService[]) => SeedService.seedServices(services);
export const seedUsers = (users?: SeedUser[]) => SeedService.seedUsers(users);
export const runFullSeed = (options?: Parameters<typeof SeedService.runFullSeed>[0]) => 
  SeedService.runFullSeed(options);
export const getStats = () => SeedService.getCollectionStats();