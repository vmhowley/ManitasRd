// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { serviceRequestService } from '../services/serviceRequestService';
import type { User } from '../types/User';
import type { ServiceRequest } from '../types/ServiceRequest';
import type { ServiceRequestData } from '../services/serviceRequestService';
import type { Technician } from '../types/Technician';

interface AuthContextType {
  user: User | null;
  serviceRequests: ServiceRequest[];
  selectedTechnician: Technician | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeUser = async () => {
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');
      if (savedToken && savedUser) {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
      }
      setLoading(false);
    };
    initializeUser();
    initializeUser();
  }, []);

  const fetchUserRequests = async () => {
    try {
      const requests = await serviceRequestService.getRequests();
      if (requests && Array.isArray(requests)) {
        setServiceRequests(requests);
      } else {
        console.error('Fetched requests data is not an array:', requests);
        setServiceRequests([]);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      await fetchUserRequests();
      await fetchUserRequests();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setServiceRequests([]);
    setSelectedTechnician(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const addServiceRequest = async (
    request: ServiceRequestData
  ) => {
    if (!user) throw new Error('Usuario no autenticado');
    try {
      await serviceRequestService.submitServiceRequest(request, user._id);
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
    if (token) {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.user);
        localStorage.setItem('authUser', JSON.stringify(response.user));
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
