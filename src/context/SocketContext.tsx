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
        console.log('Socket conectado:', newSocket.id);
        // No unirse automáticamente a ninguna sala aquí
        // Las salas se manejarán específicamente en cada componente
      });
      
      newSocket.on('connect_error', () => {
        // Intentar reconectar manualmente después de un error
        setTimeout(() => {
          newSocket.connect();
        }, 3000);
      });
      
      newSocket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconectado, intento:', attemptNumber);
        // Las salas se manejarán específicamente en cada componente
      });
      
      newSocket.on('reconnect_error', () => {
      });
      
      newSocket.on('reconnect_failed', () => {
        // Intentar una última reconexión manual
        setTimeout(() => {
          newSocket.connect();
        }, 5000);
      });
      
      setSocket(newSocket);

      // Escuchar evento de confirmación de conexión
      newSocket.on('connectionConfirmed', () => {
      });

      // Escuchar todos los eventos para depuración
      newSocket.onAny(() => {
      });

      return () => {
        newSocket.removeAllListeners();
        newSocket.close();
      };
    } else {
      // If there is no user, disconnect any existing socket
      if (socket) {
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
