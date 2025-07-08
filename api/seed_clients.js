import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/Users.js';

dotenv.config();

const clientNames = [
  'Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Eve Adams',
  'Frank White', 'Grace Lee', 'Henry Wilson', 'Ivy King', 'Jack Green',
];

const seedClients = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado para el seeder de clientes.');

    // Optional: Clear existing clients before seeding
    await User.deleteMany({ type: 'client' });
    console.log('Clientes anteriores eliminados.');

    for (let i = 0; i < clientNames.length; i++) {
      const name = clientNames[i];
      const email = `${name.toLowerCase().replace(/ /g, '.')}@example.com`;
      const password = 'password123'; // Default password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newClient = new User({
        name,
        email,
        password: hashedPassword,
        type: 'client',
        phone: `809-555-${1000 + i}`,
        address: `Calle Falsa ${i + 1}23, Ciudad Ejemplo`,
        avatar: '/vite.svg',
      });

      await newClient.save();
      console.log(`Cliente ${newClient.name} (${newClient.email}) creado.`);
    }

    console.log('¡Clientes de ejemplo insertados con éxito!');

  } catch (error) {
    console.error('Error en el seeder de clientes:', error);
  } finally {
    mongoose.connection.close();
    console.log('Conexión de MongoDB cerrada.');
  }
};

seedClients();
