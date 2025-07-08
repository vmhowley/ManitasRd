// models/Solicitud.js
import mongoose from 'mongoose'

const solicitudSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  category: String,
  address: String,
  requestDate: Date,
  urgency: String,
  clientBudget: Number,
  finalPrice: { type: Number }, // New field for standard services
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // New field for standard services
  status: {
    type: String,
    enum: ["pending", "in-process", "cancelled", "completed", "assigned"],
    default: "pending",
  },
});

export default mongoose.model('Solicitud', solicitudSchema)
