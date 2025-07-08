import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('authToken')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
  }
  return req;
});

export const uploadService = {
  uploadImages: (formData: FormData) => API.post<{ files: string[] }>('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};
