// server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import authRoutes from './routes/auth.routes.js'
import solicitudRoutes from './routes/solicitud.routes.js'
import technicianRoutes from './routes/technician.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import quoteRequestRoutes from './routes/quoteRequest.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import serviceRoutes from './routes/service.routes.js'
import reviewRoutes from './routes/review.routes.js'

import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configuración específica de CORS para Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? "https://manitasrd-api.onrender.com" : ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

console.log('Socket.io configurado con CORS para:', process.env.NODE_ENV === 'production' ? "https://tudominio.com" : "http://localhost:5173 y http://localhost:5174");

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Pass io instance to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quote-requests', quoteRequestRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(500).send('Something broke!');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Verificar el token de autenticación
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      // Verificar el token sin validar expiración para evitar desconexiones frecuentes
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      console.log('Usuario autenticado en socket:', decoded.id);
      socket.userId = decoded.id;
    } catch (err) {
      console.error('Error al verificar token en socket:', err);
    }
  } else {
    console.log('Conexión de socket sin token de autenticación');
  }

  socket.on('joinRoom', (roomId) => {
    if (!roomId) {
      console.error('Intento de unirse a sala sin ID válido');
      socket.emit('error', { message: 'ID de sala no válido' });
      return;
    }
    
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Enviar un mensaje al cliente para confirmar la conexión
    socket.emit('connectionConfirmed', { 
      message: 'Conectado correctamente', 
      socketId: socket.id,
      roomId: roomId
    });
  });

  socket.on('leaveRoom', (roomId) => {
    if (roomId) {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    }
  });
  


  // Agregar listeners para depuración
  socket.onAny((event, ...args) => {
    console.log(`[Socket ${socket.id}] Evento: ${event}`, args);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

// Conexión DB
console.log("env", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo conectado'))
  .catch((err) => console.error('Error al conectar Mongo:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

