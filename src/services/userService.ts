import { api } from '../api/config';
import type { User, TechnicianUpdatePayload } from '../types/User';

const API_URL = '/users';

export const userService = {
  async getTechnicians() {
    try {
      const response = await api.get(`${API_URL}/technicians`);
      return response.data;
    } catch (error) {
      console.error('Error fetching technicians:', error);
      throw error;
    }
  },

  async getChatContacts() {
    try {
      
      const response = await api.get(`${API_URL}/chat-contacts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat contacts:', error);
      throw error;
    }
  },

  async getUserById(id: string) {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  async updateUserProfile(profileData: any) {
    try {
      
      const response = await api.put(`${API_URL}/profile`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};