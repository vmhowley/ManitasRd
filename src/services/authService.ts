import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { User } from '../types/User';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Obtener datos adicionales del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      const userData = userDoc.data() as User;
      const token = await firebaseUser.getIdToken();
      
      return {
        user: {
          ...userData,
          id: userDoc.id,
        },
        token
      };
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userType: string
  ) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Crear documento de usuario en Firestore
      const userDoc = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: `${firstName} ${lastName}`,
        type: userType as any, // Corregir el error de tipo
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
      
      const token = await firebaseUser.getIdToken();
      
      return {
        user: {
          ...userDoc,
          id: firebaseUser.uid,
        },
        token
      };
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        return null;
      }
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return {
        ...userDoc.data(),
        id: userDoc.id,
      } as User;
    } catch (error: any) {
      console.error('Get current user error:', error.message);
      return null;
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Reset password error:', error.message);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw error;
    }
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    const auth = getAuth();
    return onAuthStateChanged(auth, callback);
  },
};
