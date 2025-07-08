import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const services = [
  // Plomería
  {
    name: 'Instalación de Inodoro',
    category: 'Plomería',
    description: 'Instalación completa de un inodoro estándar. No incluye el costo del inodoro.',
    basePrice: 2500,
  },
  {
    name: 'Reparación de Fuga de Grifo',
    category: 'Plomería',
    description: 'Diagnóstico y reparación de fugas en grifos de cocina o baño.',
    basePrice: 1200,
  },
  // Electricidad
  {
    name: 'Instalación de Tomacorriente',
    category: 'Electricidad',
    description: 'Instalación de un nuevo punto de tomacorriente. Incluye cableado básico.',
    basePrice: 1500,
    priceModifiers: [
      { name: 'Punto doble', additionalCost: 300 },
      { name: 'Cableado complejo (>5m)', additionalCost: 500 },
    ],
  },
  {
    name: 'Instalación de Abanico de Techo',
    category: 'Electricidad',
    description: 'Ensamblaje e instalación de un abanico de techo en un punto de luz existente.',
    basePrice: 1800,
  },
  // Pintura
  {
    name: 'Pintura de Habitación (por m²)',
    category: 'Pintura',
    description: 'Aplicación de dos capas de pintura en paredes. No incluye la pintura.',
    basePrice: 250, // Precio por metro cuadrado
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado para el seeder.');

    // Limpiar la colección antes de insertar
    await Service.deleteMany({});
    console.log('Servicios anteriores eliminados.');

    await Service.insertMany(services);
    console.log('¡Servicios de ejemplo insertados con éxito!');

  } catch (error) {
    console.error('Error en el seeder:', error);
  } finally {
    mongoose.connection.close();
    console.log('Conexión de MongoDB cerrada.');
  }
};

seedDB();
