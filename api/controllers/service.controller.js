import Service from '../models/Service.js';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('category name');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new service (for admin purposes)
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  // Basic authorization - in a real app, this should be a proper admin check
  if (!req.user || req.user.type !== 'admin') { // Assuming an 'admin' user type
      return res.status(403).json({ message: 'Acceso no autorizado.' });
  }

  try {
    const { name, category, description, basePrice, priceModifiers } = req.body;

    const newService = new Service({
      name,
      category,
      description,
      basePrice,
      priceModifiers: priceModifiers || [],
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: `Error creating service: ${error.message}` });
  }
};
