import { api } from '../api/config';

const API_URL = '/messages';

export const messageService = {
  sendMessage: async (receiverId: string, content: string) => {
    try {
      
      const response = await api.post(`${API_URL}`, { receiver: receiverId, content });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  getMessages: async (otherUserId: string) => {
    try {
      
      const response = await api.get(`${API_URL}/${otherUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },
};