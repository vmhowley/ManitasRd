import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { User } from '../types/User';

export const userService = {
  async getTechnicians(): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('type', '==', 'technician'),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const technicians: User[] = [];
      
      querySnapshot.forEach((doc) => {
        technicians.push({
          ...doc.data(),
          _id: doc.id
        } as User);
      });
      
      return technicians;
    } catch (error) {
      console.error('Error fetching technicians:', error);
      throw error;
    }
  },

  async getChatContacts(): Promise<User[]> {
    try {
      // Para obtener contactos de chat, podríamos obtener todos los usuarios activos
      // o implementar una lógica más específica según los requerimientos
      const q = query(
        collection(db, 'users'),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const contacts: User[] = [];
      
      querySnapshot.forEach((doc) => {
        contacts.push({
          ...doc.data(),
          _id: doc.id
        } as User);
      });
      
      return contacts;
    } catch (error) {
      console.error('Error fetching chat contacts:', error);
      throw error;
    }
  },

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return {
          ...userDoc.data(),
          _id: userDoc.id
        } as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, userData);
      
      // Obtener el usuario actualizado
      const updatedUser = await this.getUserById(userId);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Alias para compatibilidad
  updateUserProfile(userId: string, userData: Partial<User>): Promise<User> {
    return this.updateUser(userId, userData);
  },
};