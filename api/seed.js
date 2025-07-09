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
  {
    name: 'Desatasco de Tuberías',
    category: 'Plomería',
    description: 'Eliminación de obstrucciones en tuberías de lavamanos, duchas o inodoros.',
    basePrice: 1800,
  },
  {
    name: 'Instalación de Calentador de Agua',
    category: 'Plomería',
    description: 'Instalación de calentador de agua eléctrico o de gas. No incluye el equipo.',
    basePrice: 3500,
  },
  {
    name: 'Reemplazo de Tuberías (sección)',
    category: 'Plomería',
    description: 'Reemplazo de una sección de tubería dañada (cobre, PVC, PEX).',
    basePrice: 4000,
  },
  {
    name: 'Instalación de Lavaplatos',
    category: 'Plomería',
    description: 'Instalación de un nuevo lavaplatos con conexión a desagüe y grifería.',
    basePrice: 2800,
  },
  {
    name: 'Reparación de Cisterna',
    category: 'Plomería',
    description: 'Reparación de mecanismos internos de cisterna de inodoro.',
    basePrice: 1000,
  },
  {
    name: 'Instalación de Ducha/Bañera',
    category: 'Plomería',
    description: 'Instalación de nueva ducha o bañera. No incluye obra civil.',
    basePrice: 6000,
  },
  {
    name: 'Mantenimiento de Bombas de Agua',
    category: 'Plomería',
    description: 'Revisión y mantenimiento preventivo de bombas de agua residenciales.',
    basePrice: 2500,
  },
  {
    name: 'Detección de Fugas (no destructiva)',
    category: 'Plomería',
    description: 'Uso de tecnología para detectar fugas sin romper paredes o suelos.',
    basePrice: 3000,
  },
  {
    name: 'Instalación de Filtro de Agua',
    category: 'Plomería',
    description: 'Instalación de sistema de filtrado de agua para toda la casa o punto de uso.',
    basePrice: 2200,
  },
  {
    name: 'Reparación de Tuberías Congeladas',
    category: 'Plomería',
    description: 'Descongelación y reparación de tuberías afectadas por el frío.',
    basePrice: 2000,
  },
  {
    name: 'Instalación de Triturador de Basura',
    category: 'Plomería',
    description: 'Instalación de triturador de basura en fregadero de cocina.',
    basePrice: 1700,
  },
  {
    name: 'Mantenimiento de Desagües',
    category: 'Plomería',
    description: 'Limpieza y mantenimiento preventivo de desagües para evitar obstrucciones.',
    basePrice: 1000,
  },
  {
    name: 'Instalación de Válvulas de Cierre',
    category: 'Plomería',
    description: 'Instalación de válvulas de cierre para control de agua en puntos específicos.',
    basePrice: 900,
  },
  {
    name: 'Revisión General de Plomería',
    category: 'Plomería',
    description: 'Inspección completa del sistema de plomería para detectar posibles problemas.',
    basePrice: 3000,
  },
  {
    name: 'Instalación de Grifo Exterior',
    category: 'Plomería',
    description: 'Instalación de un grifo de jardín o exterior.',
    basePrice: 1500,
  },
  {
    name: 'Reparación de Inodoro que Gotea',
    category: 'Plomería',
    description: 'Diagnóstico y reparación de inodoro que gotea constantemente.',
    basePrice: 1100,
  },
  {
    name: 'Instalación de Bidet',
    category: 'Plomería',
    description: 'Instalación de un bidet con conexiones de agua fría y caliente.',
    basePrice: 3200,
  },
  {
    name: 'Servicio de Emergencia 24/7 Plomería',
    category: 'Plomería',
    description: 'Atención de emergencias de plomería fuera de horario laboral.',
    basePrice: 5000,
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
    name: "Instalación de Tomacorriente",
    category: "Electricidad",
    description: "Instalación de un nuevo punto de tomacorriente. Incluye cableado básico.",
    basePrice: 1800,
    priceModifiers: [
      { name: "Punto doble", "additionalCost": 400 },
      { name: "Cableado complejo (>5m)", "additionalCost": 600 }
    ]
  },
  {
    name: "Instalación de Abanico de Techo",
    category: "Electricidad",
    description: "Ensamblaje e instalación de un abanico de techo en un punto de luz existente.",
    basePrice: 2200
  },
  {
    name: "Reemplazo de Interruptor de Luz",
    category: "Electricidad",
    description: "Reemplazo de interruptor de luz simple o doble.",
    basePrice: 1000
  },
  {
    name: "Revisión de Panel Eléctrico",
    category: "Electricidad",
    description: "Inspección y diagnóstico de problemas en el panel eléctrico principal.",
    basePrice: 2500
  },
  {
    name: "Instalación de Lámparas/Focos",
    category: "Electricidad",
    description: "Instalación de luminarias de techo o pared.",
    basePrice: 1200
  },
  {
    name: "Cableado de Red (Ethernet)",
    category: "Electricidad",
    description: "Instalación de puntos de red cableada para internet.",
    basePrice: 1500
  },
  {
    name: "Instalación de Timbre",
    category: "Electricidad",
    description: "Instalación o reemplazo de timbre eléctrico.",
    basePrice: 900
  },
  {
    name: "Reparación de Cortocircuito",
    category: "Electricidad",
    description: "Localización y reparación de cortocircuitos en la instalación eléctrica.",
    basePrice: 3000
  },
  {
    name: "Instalación de Sensor de Movimiento",
    category: "Electricidad",
    description: "Instalación de sensores de movimiento para iluminación o seguridad.",
    basePrice: 1400
  },
  {
    name: "Mantenimiento de Aires Acondicionados",
    category: "Electricidad",
    description: "Revisión y limpieza de unidades de aire acondicionado (eléctrico).",
    basePrice: 2500
  },
  {
    name: "Instalación de Regulador de Voltaje",
    category: "Electricidad",
    description: "Instalación de regulador de voltaje para protección de equipos.",
    basePrice: 1800
  },
  {
    name: "Reemplazo de Breaker/Fusible",
    category: "Electricidad",
    description: "Reemplazo de breaker o fusible defectuoso en panel eléctrico.",
    basePrice: 1000
  },
  {
    name: "Instalación de Iluminación Exterior",
    category: "Electricidad",
    description: "Instalación de luces para jardín, patio o fachada.",
    basePrice: 2800
  },
  {
    name: "Diagnóstico de Fallas Eléctricas",
    category: "Electricidad",
    description: "Diagnóstico de problemas eléctricos generales en el hogar.",
    basePrice: 1800
  },
  {
    name: "Instalación de Calentador de Agua Eléctrico",
    category: "Electricidad",
    description: "Conexión e instalación de calentador de agua eléctrico.",
    basePrice: 3500
  },
  {
    name: "Instalación de Extractor de Aire",
    category: "Electricidad",
    description: "Instalación de extractor de aire en baño o cocina.",
    basePrice: 2000
  },
  {
    name: "Revisión de Puesta a Tierra",
    category: "Electricidad",
    description: "Verificación y mejora del sistema de puesta a tierra.",
    basePrice: 1800
  },
  {
    name: "Instalación de Cargador de Vehículo Eléctrico",
    category: "Electricidad",
    description: "Instalación de estación de carga para vehículos eléctricos residenciales.",
    basePrice: 8500
  },
  {
    name: "Instalación de Sistema de Alarma",
    category: "Electricidad",
    description: "Instalación de sistema de alarma básico para el hogar.",
    basePrice: 4000
  },
  {
    name: "Servicio de Emergencia 24/7 Electricidad",
    category: "Electricidad",
    description: "Atención de emergencias eléctricas fuera de horario laboral.",
    basePrice: 6500
  },

  // Pintura
  {
    name: 'Pintura de Habitación (por m²)',
    category: 'Pintura',
    description: 'Aplicación de dos capas de pintura en paredes. No incluye la pintura.',
    basePrice: 250, // Precio por metro cuadrado
  },
  {
    name: 'Pintura de Techo (por m²)',
    category: 'Pintura',
    description: 'Aplicación de dos capas de pintura en techos. No incluye la pintura.',
    basePrice: 300, // Precio por metro cuadrado
  },
  {
    name: 'Reparación de Paredes Menores',
    category: 'Pintura',
    description: 'Relleno de pequeños agujeros y grietas antes de pintar.',
    basePrice: 700,
  },
  {
    name: 'Pintura Exterior (por m²)',
    category: 'Pintura',
    description: 'Aplicación de pintura en fachadas y muros exteriores. No incluye la pintura.',
    basePrice: 350,
  },
  {
    name: 'Pintura de Puertas y Marcos',
    category: 'Pintura',
    description: 'Lijado y pintura de puertas y marcos de madera o metal.',
    basePrice: 800,
  },
  {
    name: 'Pintura de Rejas/Barandales',
    category: 'Pintura',
    description: 'Limpieza, lijado y pintura de rejas o barandales de metal.',
    basePrice: 600,
  },
  {
    name: 'Remoción de Papel Tapiz',
    category: 'Pintura',
    description: 'Remoción de papel tapiz existente y preparación de la pared.',
    basePrice: 400,
  },
  {
    name: 'Aplicación de Estuco/Textura',
    category: 'Pintura',
    description: 'Aplicación de estuco o texturas decorativas en paredes.',
    basePrice: 500,
  },
  {
    name: 'Pintura de Gabinetes de Cocina',
    category: 'Pintura',
    description: 'Lijado, imprimación y pintura de gabinetes de cocina.',
    basePrice: 4000,
  },
  {
    name: 'Pintura de Pisos de Concreto',
    category: 'Pintura',
    description: 'Preparación y pintura de pisos de concreto en garajes o sótanos.',
    basePrice: 200,
  },
  {
    name: 'Pintura de Líneas de Estacionamiento',
    category: 'Pintura',
    description: 'Pintura de líneas y señalización en estacionamientos.',
    basePrice: 150,
  },
  {
    name: 'Pintura de Muebles (pequeños)',
    category: 'Pintura',
    description: 'Lijado y pintura de muebles pequeños como sillas o mesas.',
    basePrice: 700,
  },
  {
    name: 'Sellado de Superficies',
    category: 'Pintura',
    description: 'Aplicación de sellador en superficies porosas antes de pintar.',
    basePrice: 180,
  },
  {
    name: 'Pintura Antihumedad',
    category: 'Pintura',
    description: 'Aplicación de pintura especial para prevenir o tratar problemas de humedad.',
    basePrice: 300,
  },
  {
    name: 'Pintura de Zócalos/Rodapiés',
    category: 'Pintura',
    description: 'Lijado y pintura de zócalos y rodapiés.',
    basePrice: 100,
  },
  {
    name: 'Pintura de Vallas/Cercas',
    category: 'Pintura',
    description: 'Limpieza y pintura de vallas o cercas de madera o metal.',
    basePrice: 200,
  },
  {
    name: 'Pintura de Piscinas',
    category: 'Pintura',
    description: 'Preparación y pintura de piscinas con pintura especializada.',
    basePrice: 8000,
  },
  {
    name: 'Pintura Decorativa (efectos)',
    category: 'Pintura',
    description: 'Aplicación de técnicas de pintura decorativa (esponjado, trapeado, etc.).',
    basePrice: 1500,
  },
  {
    name: 'Limpieza Post-Pintura',
    category: 'Pintura',
    description: 'Limpieza de residuos de pintura y protección de superficies.',
    basePrice: 500,
  },
  {
    name: 'Servicio de Emergencia 24/7 Pintura',
    category: 'Pintura',
    description: 'Atención de emergencias de pintura fuera de horario laboral.',
    basePrice: 4000,
  },

  // Jardinería
  {
    name: 'Corte de Césped',
    category: 'Jardinería',
    description: 'Corte y recolección de césped en áreas residenciales.',
    basePrice: 1000,
    priceModifiers: [
      { name: 'Jardín grande (>100m²)', additionalCost: 500 },
      { name: 'Desmalezado', additionalCost: 300 },
    ],
  },
  {
    name: 'Poda de Arbustos',
    category: 'Jardinería',
    description: 'Poda y modelado de arbustos y setos.',
    basePrice: 1500,
  },
  {
    name: 'Mantenimiento de Jardín',
    category: 'Jardinería',
    description: 'Mantenimiento general de jardín, incluyendo riego, fertilización y limpieza.',
    basePrice: 2000,
  },
  {
    name: 'Siembra de Flores/Plantas',
    category: 'Jardinería',
    description: 'Preparación de tierra y siembra de flores o plantas de temporada.',
    basePrice: 800,
  },
  {
    name: 'Instalación de Sistema de Riego',
    category: 'Jardinería',
    description: 'Diseño e instalación de sistemas de riego automático.',
    basePrice: 7000,
  },
  {
    name: 'Fertilización de Jardín',
    category: 'Jardinería',
    description: 'Aplicación de fertilizantes para el crecimiento saludable de plantas.',
    basePrice: 900,
  },
  {
    name: 'Control de Plagas (Jardín)',
    category: 'Jardinería',
    description: 'Aplicación de tratamientos para el control de plagas en plantas y césped.',
    basePrice: 1200,
  },
  {
    name: 'Poda de Árboles (pequeños)',
    category: 'Jardinería',
    description: 'Poda de ramas de árboles pequeños para mantenimiento o forma.',
    basePrice: 2500,
  },
  {
    name: 'Diseño de Jardines',
    category: 'Jardinería',
    description: 'Creación de un plan de diseño para un nuevo jardín o remodelación.',
    basePrice: 5000,
  },
  {
    name: 'Instalación de Césped Artificial',
    category: 'Jardinería',
    description: 'Preparación del terreno e instalación de césped artificial.',
    basePrice: 4000,
  },
  {
    name: 'Limpieza de Hojas y Residuos',
    category: 'Jardinería',
    description: 'Recolección y eliminación de hojas caídas y otros residuos del jardín.',
    basePrice: 700,
  },
  {
    name: 'Instalación de Caminos/Senderos',
    category: 'Jardinería',
    description: 'Construcción de caminos o senderos con adoquines, grava o losas.',
    basePrice: 3000,
  },
  {
    name: 'Mantenimiento de Piscinas (Jardín)',
    category: 'Jardinería',
    description: 'Limpieza y mantenimiento químico de piscinas en el jardín.',
    basePrice: 2000,
  },
  {
    name: 'Instalación de Vallas/Cercas (Jardín)',
    category: 'Jardinería',
    description: 'Instalación de vallas o cercas decorativas para jardín.',
    basePrice: 2800,
  },
  {
    name: 'Creación de Huertos Urbanos',
    category: 'Jardinería',
    description: 'Diseño y construcción de huertos urbanos en espacios reducidos.',
    basePrice: 1800,
  },
  {
    name: 'Trasplante de Árboles/Plantas',
    category: 'Jardinería',
    description: 'Traslado de árboles o plantas de un lugar a otro en el jardín.',
    basePrice: 1500,
  },
  {
    name: 'Instalación de Iluminación de Jardín',
    category: 'Jardinería',
    description: 'Instalación de luces decorativas o funcionales para el jardín.',
    basePrice: 2200,
  },
  {
    name: 'Control de Malezas',
    category: 'Jardinería',
    description: 'Eliminación manual o química de malezas en el jardín.',
    basePrice: 600,
  },
  {
    name: 'Abonado de Suelo',
    category: 'Jardinería',
    description: 'Mejora de la calidad del suelo mediante la adición de abono orgánico.',
    basePrice: 900,
  },
  {
    name: 'Servicio de Emergencia 24/7 Jardinería',
    category: 'Jardinería',
    description: 'Atención de emergencias de jardinería fuera de horario laboral.',
    basePrice: 4500,
  },

  // Limpieza
  {
    name: 'Limpieza Profunda de Hogar',
    category: 'Limpieza',
    description: 'Limpieza exhaustiva de todas las áreas del hogar, incluyendo rincones difíciles.',
    basePrice: 3500,
  },
  {
    name: 'Limpieza de Oficinas (por m²)',
    category: 'Limpieza',
    description: 'Limpieza regular o profunda de espacios de oficina.',
    basePrice: 150,
  },
  {
    name: 'Limpieza de Alfombras/Tapetes',
    category: 'Limpieza',
    description: 'Limpieza a vapor o en seco de alfombras y tapetes.',
    basePrice: 1000,
  },
  {
    name: 'Limpieza de Ventanas (interior/exterior)',
    category: 'Limpieza',
    description: 'Limpieza profesional de ventanas, incluyendo marcos y rieles.',
    basePrice: 800,
  },
  {
    name: 'Limpieza Post-Construcción',
    category: 'Limpieza',
    description: 'Limpieza a fondo después de obras o remodelaciones.',
    basePrice: 5000,
  },
  {
    name: 'Limpieza de Muebles Tapizados',
    category: 'Limpieza',
    description: 'Limpieza especializada de sofás, sillas y otros muebles tapizados.',
    basePrice: 1200,
  },
  {
    name: 'Limpieza de Cocinas Industriales',
    category: 'Limpieza',
    description: 'Limpieza profunda de cocinas en restaurantes o negocios.',
    basePrice: 6000,
  },
  {
    name: 'Limpieza de Baños (comercial/residencial)',
    category: 'Limpieza',
    description: 'Desinfección y limpieza profunda de baños.',
    basePrice: 900,
  },
  {
    name: 'Limpieza de Pisos (pulido/encerado)',
    category: 'Limpieza',
    description: 'Pulido y encerado de pisos de madera, mármol o baldosas.',
    basePrice: 2000,
  },
  {
    name: 'Limpieza de Cristales en Altura',
    category: 'Limpieza',
    description: 'Limpieza de cristales en edificios de varios pisos.',
    basePrice: 4000,
  },
  {
    name: 'Limpieza de Garajes/Trasteros',
    category: 'Limpieza',
    description: 'Organización y limpieza de garajes o trasteros.',
    basePrice: 1800,
  },
  {
    name: 'Limpieza de Colchones',
    category: 'Limpieza',
    description: 'Limpieza y desinfección de colchones.',
    basePrice: 1000,
  },
  {
    name: 'Limpieza de Persianas/Cortinas',
    category: 'Limpieza',
    description: 'Limpieza de persianas, cortinas y estores.',
    basePrice: 700,
  },
  {
    name: 'Limpieza de Conductos de Aire',
    category: 'Limpieza',
    description: 'Limpieza de conductos de ventilación y aire acondicionado.',
    basePrice: 2500,
  },
  {
    name: 'Limpieza de Fachadas',
    category: 'Limpieza',
    description: 'Limpieza de fachadas de edificios con hidrolavadora o productos especiales.',
    basePrice: 3000,
  },
  {
    name: 'Limpieza de Vehículos (interior)',
    category: 'Limpieza',
    description: 'Limpieza profunda del interior de vehículos.',
    basePrice: 1500,
  },
  {
    name: 'Limpieza de Eventos (pre/post)',
    category: 'Limpieza',
    description: 'Servicio de limpieza antes y después de eventos.',
    basePrice: 2000,
  },
  {
    name: 'Control de Olores',
    category: 'Limpieza',
    description: 'Tratamiento para eliminar olores persistentes en espacios.',
    basePrice: 1300,
  },
  {
    name: 'Limpieza de Moho y Hongos',
    category: 'Limpieza',
    description: 'Remoción y tratamiento de moho y hongos en superficies.',
    basePrice: 2200,
  },
  {
    name: 'Servicio de Emergencia 24/7 Limpieza',
    category: 'Limpieza',
    description: 'Atención de emergencias de limpieza fuera de horario laboral.',
    basePrice: 4800,
  },

  // Carpintería
  {
    name: 'Reparación de Muebles de Madera',
    category: 'Carpintería',
    description: 'Reparación de sillas, mesas, armarios y otros muebles de madera.',
    basePrice: 1500,
  },
  {
    name: 'Instalación de Puertas',
    category: 'Carpintería',
    description: 'Instalación de puertas interiores o exteriores, incluyendo marcos y herrajes.',
    basePrice: 3000,
  },
  {
    name: 'Instalación de Ventanas de Madera',
    category: 'Carpintería',
    description: 'Instalación de ventanas de madera a medida o prefabricadas.',
    basePrice: 4000,
  },
  {
    name: 'Construcción de Estanterías a Medida',
    category: 'Carpintería',
    description: 'Diseño y construcción de estanterías personalizadas de madera.',
    basePrice: 2500,
  },
  {
    name: 'Reparación de Pisos de Madera',
    category: 'Carpintería',
    description: 'Reparación de tablas sueltas, rayadas o dañadas en pisos de madera.',
    basePrice: 1800,
  },
  {
    name: 'Instalación de Zócalos/Rodapiés',
    category: 'Carpintería',
    description: 'Instalación de zócalos o rodapiés de madera en habitaciones.',
    basePrice: 700,
  },
  {
    name: 'Construcción de Pérgolas/Decks',
    category: 'Carpintería',
    description: 'Diseño y construcción de pérgolas o decks de madera para exteriores.',
    basePrice: 8000,
  },
  {
    name: 'Reparación de Techos de Madera',
    category: 'Carpintería',
    description: 'Reparación de vigas, tablas o estructuras de techos de madera.',
    basePrice: 5000,
  },
  {
    name: 'Fabricación de Muebles a Medida',
    category: 'Carpintería',
    description: 'Fabricación de muebles de madera personalizados según diseño del cliente.',
    basePrice: 6000,
  },
  {
    name: 'Instalación de Armarios Empotrados',
    category: 'Carpintería',
    description: 'Diseño e instalación de armarios empotrados a medida.',
    basePrice: 7500,
  },
  {
    name: 'Reparación de Escaleras de Madera',
    category: 'Carpintería',
    description: 'Reparación de peldaños, barandales o pasamanos de escaleras de madera.',
    basePrice: 2000,
  },
  {
    name: 'Instalación de Molduras Decorativas',
    category: 'Carpintería',
    description: 'Instalación de molduras decorativas en paredes o techos.',
    basePrice: 900,
  },
  {
    name: 'Restauración de Muebles Antiguos',
    category: 'Carpintería',
    description: 'Restauración y pulido de muebles de madera antiguos.',
    basePrice: 3000,
  },
  {
    name: 'Instalación de Encimeras de Madera',
    category: 'Carpintería',
    description: 'Instalación de encimeras de madera en cocinas o baños.',
    basePrice: 2800,
  },
  {
    name: 'Construcción de Casitas de Jardín/Almacenes',
    category: 'Carpintería',
    description: 'Construcción de estructuras de madera para jardín o almacenamiento.',
    basePrice: 9000,
  },
  {
    name: 'Reparación de Vallas/Cercas de Madera',
    category: 'Carpintería',
    description: 'Reparación de postes, tablas o secciones de vallas de madera.',
    basePrice: 1000,
  },
  {
    name: 'Instalación de Suelos Laminados/Flotantes',
    category: 'Carpintería',
    description: 'Instalación de suelos laminados o flotantes en habitaciones.',
    basePrice: 1200,
  },
  {
    name: 'Fabricación de Marcos a Medida',
    category: 'Carpintería',
    description: 'Fabricación de marcos de madera para cuadros o espejos.',
    basePrice: 600,
  },
  {
    name: 'Ajuste de Puertas/Ventanas',
    category: 'Carpintería',
    description: 'Ajuste de puertas o ventanas que no cierran correctamente.',
    basePrice: 800,
  },
  {
    name: 'Servicio de Emergencia 24/7 Carpintería',
    category: 'Carpintería',
    description: 'Atención de emergencias de carpintería fuera de horario laboral.',
    basePrice: 5200,
  },

  // Automotriz
  {
    name: 'Cambio de Aceite y Filtro',
    category: 'Automotriz',
    description: 'Reemplazo de aceite de motor y filtro de aceite.',
    basePrice: 1500,
  },
  {
    name: 'Revisión de Frenos',
    category: 'Automotriz',
    description: 'Inspección de pastillas, discos y líquido de frenos.',
    basePrice: 1000,
  },
  {
    name: 'Cambio de Batería',
    category: 'Automotriz',
    description: 'Reemplazo e instalación de batería de auto. No incluye el costo de la batería.',
    basePrice: 800,
  },
  {
    name: 'Alineación y Balanceo',
    category: 'Automotriz',
    description: 'Ajuste de la dirección y balanceo de neumáticos para un desgaste uniforme.',
    basePrice: 2000,
  },
  {
    name: 'Revisión de Suspensión',
    category: 'Automotriz',
    description: 'Inspección de amortiguadores, resortes y componentes de la suspensión.',
    basePrice: 1200,
  },
  {
    name: 'Diagnóstico de Motor (Check Engine)',
    category: 'Automotriz',
    description: 'Uso de escáner para diagnosticar códigos de error del motor.',
    basePrice: 2500,
  },
  {
    name: 'Cambio de Bujías',
    category: 'Automotriz',
    description: 'Reemplazo de bujías para mejorar el rendimiento del motor.',
    basePrice: 900,
  },
  {
    name: 'Revisión de Sistema de Enfriamiento',
    category: 'Automotriz',
    description: 'Inspección de radiador, mangueras y niveles de refrigerante.',
    basePrice: 1100,
  },
  {
    name: 'Cambio de Neumáticos',
    category: 'Automotriz',
    description: 'Montaje y desmontaje de neumáticos. No incluye el costo del neumático.',
    basePrice: 500,
  },
  {
    name: 'Reparación de Pinchazos',
    category: 'Automotriz',
    description: 'Reparación de pinchazos en neumáticos.',
    basePrice: 300,
  },
  {
    name: 'Revisión de Luces',
    category: 'Automotriz',
    description: 'Inspección y reemplazo de bombillas de luces exteriores e interiores.',
    basePrice: 400,
  },
  {
    name: 'Cambio de Filtro de Aire',
    category: 'Automotriz',
    description: 'Reemplazo del filtro de aire del motor.',
    basePrice: 350,
  },
  {
    name: 'Revisión de Correas (Motor)',
    category: 'Automotriz',
    description: 'Inspección de correas de accesorios y distribución.',
    basePrice: 600,
  },
  {
    name: 'Carga de Aire Acondicionado',
    category: 'Automotriz',
    description: 'Recarga de gas refrigerante del sistema de aire acondicionado.',
    basePrice: 1800,
  },
  {
    name: 'Revisión Pre-Viaje',
    category: 'Automotriz',
    description: 'Inspección general del vehículo antes de un viaje largo.',
    basePrice: 1500,
  },
  {
    name: 'Limpieza de Inyectores',
    category: 'Automotriz',
    description: 'Limpieza de inyectores de combustible para optimizar el rendimiento.',
    basePrice: 1700,
  },
  {
    name: 'Revisión de Dirección Asistida',
    category: 'Automotriz',
    description: 'Inspección de la bomba, mangueras y líquido de dirección asistida.',
    basePrice: 1000,
  },
  {
    name: 'Cambio de Amortiguadores',
    category: 'Automotriz',
    description: 'Reemplazo de amortiguadores delanteros o traseros.',
    basePrice: 3000,
  },
  {
    name: 'Revisión de Escape',
    category: 'Automotriz',
    description: 'Inspección de fugas, corrosión y daños en el sistema de escape.',
    basePrice: 700,
  },
  {
    name: 'Servicio de Emergencia 24/7 Mecánica',
    category: 'Automotriz',
    description: 'Atención de emergencias mecánicas fuera de horario laboral.',
    basePrice: 6000,
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
