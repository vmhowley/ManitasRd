import User from '../models/Users.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle servicesOffered if it's sent as a JSON string
    if (updates.servicesOffered && typeof updates.servicesOffered === 'string') {
      updates.servicesOffered = JSON.parse(updates.servicesOffered);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).populate('servicesOffered.service');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};