import mongoose from 'mongoose';

const PriceModifierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  additionalCost: {
    type: Number,
    required: true,
  },
});

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  unitType: {
    type: String, // e.g., 'hour', 'sq_meter', 'unit', 'fixed'
    required: false, // Make true if all services will have a unit
  },
  pricePerUnit: {
    type: Number,
    required: false, // Make true if all services will have a unit price
  },
  priceModifiers: [PriceModifierSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Service', ServiceSchema);
