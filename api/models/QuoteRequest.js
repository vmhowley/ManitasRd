import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  laborCost: {
    type: Number,
    required: true,
  },
  materialsCost: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuoteRequestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // To store URLs of uploaded images
  }],
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'quoted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  proposals: [ProposalSchema],
  selectedTechnicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  acceptedProposalId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('QuoteRequest', QuoteRequestSchema);
