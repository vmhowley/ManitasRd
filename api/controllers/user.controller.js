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

// Get chat contacts based on user type and accepted service requests
export const getChatContacts = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);
    console.log("🚀 ~ getChatContacts ~ currentUser:", currentUser)

    if (!currentUser) {
      console.error('Error: currentUser is null or undefined for ID:', currentUserId);
      return res.status(404).json({ msg: 'Usuario actual no encontrado.' });
    }

    // Import models
    const Solicitud = (await import('../models/Solicitud.js')).default;
    const Message = (await import('../models/Message.js')).default;

    let userIds = [];
    
    if (currentUser.type === 'technician') {
      // Technician can only chat with clients who have accepted service requests
      const acceptedRequests = await Solicitud.find({
        technicianId: currentUserId,
        status: { $in: ['assigned', 'in-process', 'completed'] }
      }).select('clientId');
      
      userIds = acceptedRequests.map(req => req.clientId);
    } else {
      // Client can only chat with technicians who have accepted their service requests
      const acceptedRequests = await Solicitud.find({
        clientId: currentUserId,
        status: { $in: ['assigned', 'in-process', 'completed'] }
      }).select('technicianId');
      
      userIds = acceptedRequests.map(req => req.technicianId);
    }

    // Filter users who actually have messages with the current user
    const usersWithMessages = [];
    
    for (const userId of userIds) {
      const messageExists = await Message.findOne({
        $or: [
          { sender: currentUserId, receiver: userId },
          { sender: userId, receiver: currentUserId }
        ]
      });
      
      if (messageExists) {
        usersWithMessages.push(userId);
      }
    }

    // Get users based on the filtered IDs (only those with existing messages)
    const users = await User.find({ 
      _id: { $in: usersWithMessages } 
    }).select('-password');

    res.json(users);
  } catch (err) {
    console.error('Error in getChatContacts:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};