// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  type: { type: String, enum: ['client', 'technician'], required: true },
  phone: String,
  address: String,
  specialties: [String],
  hourlyRate: Number,
  avatar: { type: String, default: '/vite.svg' },
  avatar: { type: String, default: '/vite.svg' },
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  regDate: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
