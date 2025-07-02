// models/Solicitud.js
import mongoose from 'mongoose'

const solicitudSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tecnicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  descripcion: String,
  categoria: String,
  direccion: String,
  fechaSolicitada: Date,
  estado: { type: String, enum: ['pendiente', 'aceptada', 'rechazada', 'finalizada'], default: 'pendiente' }
})

export default mongoose.model('Solicitud', solicitudSchema)
