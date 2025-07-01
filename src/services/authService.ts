import type { User } from '../types/User';

interface LoginResponse {
  user: User;
  token: string;
}

// This is a mock API service. In a real application, you would replace these
// with actual API calls (e.g., using fetch or axios).

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === 'password') {
          const mockUser: User = {
            id: '1',
            name: email === 'tech@example.com' ? 'Carlos Mendoza' : 'María García',
            email: email,
            type: (email === 'tech@example.com' ? 'technician' : 'client'),
            phone: '+1234567890',
            address: 'Calle Principal 123',
            rating: email === 'tech@example.com' ? 4.9 : undefined,
            specialties: email === 'tech@example.com' ? ['Plomería', 'Electricidad'] : undefined,
          };
          resolve({ user: mockUser, token: 'mock-jwt-token' });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  register: async (userData: Partial<User>): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now().toString(),
          type: 'client', // Default to client for registration
          ...userData,
          name: userData.name || 'New User',
          email: userData.email || `user${Date.now()}@example.com`,
        } as User;
        resolve({ user: newUser, token: 'mock-jwt-token-new' });
      }, 500);
    });
  },

  // You can add more authentication related functions here, e.g., logout, forgot password, etc.
};