// server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import solicitudRoutes from './routes/solicitud.routes.js'
import technicianRoutes from './routes/technician.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import quoteRequestRoutes from './routes/quoteRequest.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import serviceRoutes from './routes/service.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/solicitudes', solicitudRoutes)
app.use('/api/technicians', technicianRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)
app.use('/api/quote-requests', quoteRequestRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/services', serviceRoutes)

// Conexión DB
console.log("env", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo conectado'))
  .catch((err) => console.error('Error al conectar Mongo:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
