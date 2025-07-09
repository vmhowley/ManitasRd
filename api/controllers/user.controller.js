import User from '../models/Users.js';

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};

// Get all technicians
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ type: 'technician' }).select('-password');
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, specialties, hourlyRate, servicesOffered } = req.body;
    const userId = req.user.id;

    const updatedData = {
      name,
      phone,
      address,
      specialties,
      hourlyRate,
      servicesOffered,
    };

    if (req.file) {
      updatedData.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};

// Get chat contacts based on user type
export const getChatContacts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      console.error('Error: currentUser is null or undefined for ID:', req.user.id);
      return res.status(404).json({ msg: 'Usuario actual no encontrado.' });
    }

    let users;
    if (currentUser.type === 'technician') {
      // Technician sees clients who have sent them a quote request or service request
      // This is a simplified logic. A more robust solution would be to fetch users based on actual interactions.
      users = await User.find({ type: 'client' }).select('-password');
    } else {
      // Client sees all technicians
      users = await User.find({ type: 'technician' }).select('-password');
    }

    res.json(users);
  } catch (err) {
    console.error('Error in getChatContacts:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};