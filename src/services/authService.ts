import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import type { User } from '../types/User';

interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Obtener datos adicionales del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Datos de usuario no encontrados');
      }
      
      const userData = userDoc.data() as User;
      const token = await firebaseUser.getIdToken();
      
      return {
        user: {
          ...userData,
          _id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email || email
        },
        token
      };
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error en el login');
    }
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    type: string;
    phone?: string;
    address?: string;
    specialties?: string[];
    hourlyRate?: string;
  }): Promise<LoginResponse> => {
    try {
      const { email, password, name, type: userType, phone, address, specialties = [], hourlyRate } = userData;
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Actualizar perfil con nombre
      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Crear documento de usuario en Firestore
      const userDoc: Partial<User> = {
        id: firebaseUser.uid,
        _id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        type: userType,
        phone: phone || undefined,
        address: address || undefined,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Agregar campos específicos según el tipo de usuario
      if (userType === 'technician') {
        Object.assign(userDoc, {
          specialties: specialties,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
          servicesOffered: [],
          rating: 0,
          reviewCount: 0,
          isAvailable: true
        });
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
      
      const token = await firebaseUser.getIdToken();
      
      return {
        user: userDoc as User,
        token
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error en el registro');
    }
  },

  getCurrentUser: async () => {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Obtener datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Datos de usuario no encontrados');
      }
      
      const userData = userDoc.data() as User;
      
      return {
        user: {
          ...userData,
          _id: firebaseUser.uid,
          email: firebaseUser.email || userData.email
        }
      };
    } catch (error: any) {
      console.error('Error al obtener usuario actual:', error);
      throw new Error(error.message || 'Error al obtener usuario actual');
    }
  },

  forgotPassword: async (email: string): Promise<{ msg: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { msg: 'Correo de recuperación enviado exitosamente' };
    } catch (error: any) {
      console.error('Error en forgot password:', error);
      throw new Error(error.message || 'Error al enviar correo de recuperación');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Error en logout:', error);
      throw new Error(error.message || 'Error al cerrar sesión');
    }
  },

  // Listener para cambios en el estado de autenticación
  onAuthStateChanged: (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};
