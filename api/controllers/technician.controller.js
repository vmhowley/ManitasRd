import User from '../models/Users.js';

export const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ type: 'technician' }).select('-password');
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching technicians', error: err.message });
  }
};