import { api } from '../api/config';

const API_URL = '/messages';

export const messageService = {
  sendMessage: async (receiverId: string, content: string) => {
    try {
      const response = await api.post(`${API_URL}`, { receiver: receiverId, content });
      return response.data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'No tienes una solicitud aceptada con este usuario para poder enviar mensajes.');
      }
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
  deleteConversation: async (otherUserId: string) => {
    try {
      const response = await api.delete(`${API_URL}/${otherUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },
};