import { 
  collection, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { User } from '../types/User';
import type { Service } from '../types/Service';
import type { ServiceRequest } from '../types/ServiceRequest';

export interface SeedService {
  seedUsers: (users: User[]) => Promise<void>;
  seedServices: (services: Service[]) => Promise<void>;
  seedServiceRequests: (requests: ServiceRequest[]) => Promise<void>;
  clearCollection: (collectionName: string) => Promise<void>;
}

export class SeedServiceImpl implements SeedService {
  async seedUsers(_users: User[]): Promise<void> {
    console.log('Seeding users...');
  }

  async seedServices(_services: Service[]): Promise<void> {
    console.log('Seeding services...');
  }

  async seedServiceRequests(_requests: ServiceRequest[]): Promise<void> {
    console.log('Seeding service requests...');
  }

  async clearCollection(collectionName: string): Promise<void> {
    const snapshot = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);
    
    snapshot.docs.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
    
    await batch.commit();
    console.log(`Collection ${collectionName} cleared`);
  }
}

export const seedService = new SeedServiceImpl();