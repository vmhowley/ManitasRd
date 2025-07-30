import axios from 'axios';

export const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`; // Usa la variable de entorno o localhost para desarrollo

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Lista de rutas que NO requieren autenticación
    const publicRoutes = ['/users/technicians'];
    
    // Verificar si la ruta actual es pública
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    // Solo agregar token si no es una ruta pública
    if (!isPublicRoute) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);