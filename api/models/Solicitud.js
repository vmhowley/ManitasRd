// models/Solicitud.js
import mongoose from 'mongoose'

const solicitudSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  category: String,
  address: String,
  requestDate: Date,
  status: {
    type: String,
    enum: ["pending", "in-process", "cancelled", "completed", "assigned"],
    default: "pending",
  },
});

export default mongoose.model('Solicitud', solicitudSchema)
