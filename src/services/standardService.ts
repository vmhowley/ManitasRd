import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Service } from '../types/Service';

// --- SERVICE METHODS ---

export const standardService = {
  /**
   * Fetches all active standard services from Firestore.
   */
  async getAllServices(): Promise<{ data: Service[] }> {
    try {
      const q = query(
        collection(db, 'services'),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const services: Service[] = [];
      
      querySnapshot.forEach((doc) => {
        services.push({
          ...doc.data(),
          _id: doc.id
        } as Service);
      });
      
      return { data: services };
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },
};

