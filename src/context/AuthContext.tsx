import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  serviceRequests: any[]; // Define a proper type for service requests later
  selectedTechnician: any; // Define a proper type for technician later
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addServiceRequest: (request: any) => void;
  setSelectedTechnician: (technician: any) => void;
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
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate initial loading or checking for existing session
  useEffect(() => {
    // In a real app, you might check localStorage for a token here
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login(email, password);
      setUser(loggedInUser);
      // In a real app, you would store the token (e.g., in localStorage)
      console.log('Logged in successfully, token:', token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to allow components to handle errors
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // In a real app, you would clear the token from storage
  };

  const addServiceRequest = (request: any) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setServiceRequests(prev => [...prev, newRequest]);
  };

  const value = {
    user,
    serviceRequests,
    selectedTechnician,
    loading,
    login,
    logout,
    addServiceRequest,
    setSelectedTechnician,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};