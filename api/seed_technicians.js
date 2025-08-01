import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/Users.js';

dotenv.config();

const specialtyOptions = [
  'Electricidad',
  'Plomería',
  'Refrigeración',
  'Reparaciones',
  'Pintura',
  'Limpieza',
  'Jardinería',
  'Carpintería',
  'Automotriz'
];

const randomNames = [
  'Juan', 'Maria', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Carlos', 'Laura', 'Diego', 'Elena',
  'Miguel', 'Isabel', 'Fernando', 'Gabriela', 'Ricardo', 'Valeria', 'Jorge', 'Daniela', 'Pablo', 'Camila'
];

const seedTechnicians = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado para el seeder de técnicos.');

    // Optional: Clear existing technicians before seeding
    await User.deleteMany({ type: 'technician' });
    console.log('Técnicos anteriores eliminados.');

    for (const specialty of specialtyOptions) {
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const email = `${specialty.toLowerCase().replace(/ /g, '.')}@ManitasRd.com`;
      const password = 'password123'; // Default password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newTechnician = new User({
        name: `${randomName} ${specialty} Tech`,
        email,
        password: hashedPassword,
        type: 'technician',
        phone: '809-555-1234',
        address: 'Santo Domingo, DR',
        specialties: [specialty],
        hourlyRate: Math.floor(Math.random() * (1500 - 500 + 1)) + 500, // Random rate between 500 and 1500
        avatar: '/vite.svg',
      });

      await newTechnician.save();
      console.log(`Técnico ${newTechnician.name} (${specialty}) creado.`);
    }

    console.log('¡Técnicos de ejemplo insertados con éxito!');

  } catch (error) {
    console.error('Error en el seeder de técnicos:', error);
  } finally {
    mongoose.connection.close();
    console.log('Conexión de MongoDB cerrada.');
  }
};

seedTechnicians();
