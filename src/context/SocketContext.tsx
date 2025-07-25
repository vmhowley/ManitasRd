import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../api/config';

// Extraer la URL base sin '/api' para la conexión de socket
const SOCKET_URL = API_BASE_URL.replace('/api', '');

interface ISocketContext {
  socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({ socket: null });

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('authToken');
      console.log('Conectando socket a:', SOCKET_URL);
      
      // Crear una nueva instancia de socket con opciones mejoradas
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,  // Aumentado para mayor persistencia
        reconnectionDelay: 1000,
        timeout: 20000,  // Aumentar el tiempo de espera para conexiones lentas
        autoConnect: true,
      });
      
      // Manejar eventos de conexión
      newSocket.on('connect', () => {
        console.log('Socket conectado con ID:', newSocket.id);
        
        // Join a room specific to the user ID to receive personal notifications
        // Verificar que user._id o user.id exista antes de emitir el evento
        const userId = user._id || user.id;
        console.log('ID de usuario para joinRoom:', userId);
        if (userId) {
          console.log('Emitiendo joinRoom con ID:', userId);
          newSocket.emit('joinRoom', userId);
        } else {
          console.error('No se pudo obtener el ID del usuario para joinRoom', user);
        }
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('Error de conexión de socket:', error);
        // Intentar reconectar manualmente después de un error
        setTimeout(() => {
          console.log('Intentando reconectar socket manualmente...');
          newSocket.connect();
        }, 3000);
      });
      
      newSocket.on('reconnect', (attemptNumber) => {
        console.log(`Socket reconectado después de ${attemptNumber} intentos`);
        // Volver a unirse a la sala después de reconectar
        const userId = user._id || user.id;
        if (userId) {
          console.log('Re-emitiendo joinRoom después de reconexión:', userId);
          newSocket.emit('joinRoom', userId);
        }
      });
      
      newSocket.on('reconnect_error', (error) => {
        console.error('Error de reconexión de socket:', error);
      });
      
      newSocket.on('reconnect_failed', () => {
        console.error('Falló la reconexión del socket después de todos los intentos');
        // Intentar una última reconexión manual
        setTimeout(() => {
          console.log('Último intento de reconexión manual...');
          newSocket.connect();
        }, 5000);
      });
      
      setSocket(newSocket);

      // Escuchar evento de confirmación de conexión
      newSocket.on('connectionConfirmed', (data) => {
        console.log('Conexión de socket confirmada:', data);
      });

      // Escuchar todos los eventos para depuración
      newSocket.onAny((event, ...args) => {
        console.log(`Socket Event Recibido: ${event}`, args);
      });

      return () => {
        console.log('Limpiando socket en SocketContext');
        newSocket.removeAllListeners();
        newSocket.close();
      };
    } else {
      // If there is no user, disconnect any existing socket
      if (socket) {
        console.log('No hay usuario, desconectando socket');
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
