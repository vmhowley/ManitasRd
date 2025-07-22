import Message from '../models/Message.js';
import Solicitud from '../models/Solicitud.js';
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user.id; // Assuming req.user.id is set by auth middleware

    // Check if there's an accepted Solicitud between sender and receiver
    const Solicitud = mongoose.model('Solicitud'); // Import Solicitud model
    const acceptedSolicitud = await Solicitud.findOne({
      $or: [
        { clientId: sender, technicianId: receiver, status: 'in-process' },
        { clientId: receiver, technicianId: sender, status: 'in-process' },
      ],
    });

    if (!acceptedSolicitud) {
      return res.status(403).json({ message: 'No accepted request found between these users.' });
    }

    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();
    
    // Populate sender info to send in the socket event
    const populatedMessage = await newMessage.populate('sender', 'name avatar');

    // Determine the room ID
    const roomId = [sender, receiver].sort().join('--');

    // Emit event to the specific chat room
    req.io.to(roomId).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id is set by auth middleware
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).populate('sender', 'name').populate('receiver', 'name').sort('timestamp');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};