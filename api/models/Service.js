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
