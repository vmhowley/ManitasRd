import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('authToken')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
  }
  return req;
});

export const messageService = {
  sendMessage: (receiverId: string, content: string) => API.post('/api/messages', { receiver: receiverId, content }),
  getMessages: (otherUserId: string) => API.get(`/api/messages/${otherUserId}`),
};
