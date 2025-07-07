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
  avatar: String,
  regDate: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
