import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { serviceRequestService } from '../services/serviceRequestService';
import type { User } from '../types/User';
import type { ServiceRequest } from '../types/ServiceRequest';
import type { Technician } from '../types/Technician';

interface AuthContextType {
  user: User | null;
  serviceRequests: ServiceRequest[];
  selectedTechnician: Technician | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'clientId'>) => Promise<void>;
  setSelectedTechnician: (technician: Technician | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (savedToken && savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchUserRequests(parsedUser);
    }
    setLoading(false);
  }, []);

  const fetchUserRequests = async (user: User) => {
    try {
      let requests: ServiceRequest[] = [];
      if (user.type === 'client') {
        requests = await serviceRequestService.getByClientId(user._id);
      } else if (user.type === 'technician') {
        requests = await serviceRequestService.getByTechnicianId(user._id);
      }
      setServiceRequests(requests);
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
      await fetchUserRequests(loggedInUser);
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
    request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'clientId'>
  ) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      await serviceRequestService.submitServiceRequest(request, user._id);
      await fetchUserRequests(user);
    } catch (error) {
      console.error('Error al agregar nueva solicitud:', error);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
