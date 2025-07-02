import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado a MongoDB Atlas correctamente');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
}

testConnection();
