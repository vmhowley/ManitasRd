// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { serviceRequestService } from '../services/serviceRequestService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import type { User as LocalUser } from '../types/User';
import type { ServiceRequest } from '../types/ServiceRequest';
import type { ServiceRequestData } from '../services/serviceRequestService';
import type { Technician } from '../types/Technician';


interface AuthContextType {
  user: LocalUser | null;
  serviceRequests: ServiceRequest[];
  selectedTechnician: Technician | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addServiceRequest: (request: ServiceRequestData) => Promise<void>;
  setSelectedTechnician: (technician: Technician | null) => void;
  refreshRequests: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchUserRequests = async (forceRefresh = false, userId?: string) => {
    const now = Date.now();
    const CACHE_DURATION = 30000; // 30 segundos de cache
    
    // Si no es forzado y el cache es válido, no hacer la llamada
    if (!forceRefresh && now - lastFetchTime < CACHE_DURATION) {
      return;
    }
    
    const targetUserId = userId || user?._id;
    if (!targetUserId) {
      console.log('No user ID available for fetching requests');
      return;
    }
    
    try {
      console.log('Fetching requests for user:', targetUserId);
      const requests = await serviceRequestService.getRequests(targetUserId);
      if (requests && Array.isArray(requests)) {
        console.log('Fetched requests:', requests.length);
        setServiceRequests(requests);
        setLastFetchTime(now);
      } else {
        console.error('Fetched requests data is not an array:', requests);
        setServiceRequests([]);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Obtener datos del usuario desde Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as LocalUser;
            const user: LocalUser = {
              ...userData,
              _id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email || userData.email
            };
            setUser(user);
            
            // Obtener token y guardarlo
            const token = await firebaseUser.getIdToken();
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(user));
            
            // Cargar las solicitudes del usuario después de autenticarse
            console.log('User authenticated, fetching requests...');
            await fetchUserRequests(true, firebaseUser.uid);
          } else {
            console.error('Usuario no encontrado en Firestore');
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setUser(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      await fetchUserRequests(true); // Forzar refresh al hacer login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // El listener de onAuthStateChanged se encargará de limpiar el estado
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar estado local en caso de error
      setUser(null);
      setServiceRequests([]);
      setSelectedTechnician(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  };

  const addServiceRequest = async (
    request: ServiceRequestData
  ) => {
    if (!user) throw new Error('Usuario no autenticado');
    try {
      await serviceRequestService.submitServiceRequest(request, user.uid);
      await fetchUserRequests();
    } catch (error) {
      console.error('Error al agregar nueva solicitud:', error);
    }
  };

  const refreshRequests = async () => {
    if (user) await fetchUserRequests();
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token && user) {
      try {
        // Refrescar datos del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', user._id));
        if (userDoc.exists()) {
          const userData = userDoc.data() as LocalUser;
          const refreshedUser: LocalUser = {
            ...userData,
            _id: user._id,
            email: user.email
          };
          setUser(refreshedUser);
          localStorage.setItem('authUser', JSON.stringify(refreshedUser));
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        logout(); // Log out if token is invalid or user not found
      }
    }
  };

  const value: AuthContextType = {
    user,
    serviceRequests,
    selectedTechnician,
    loading,
    login,
    logout,
    addServiceRequest,
    setSelectedTechnician,
    refreshRequests,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
