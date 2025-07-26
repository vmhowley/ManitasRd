import Message from '../models/Message.js';
import Solicitud from '../models/Solicitud.js';
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user.id; // Assuming req.user.id is set by auth middleware

    // Check if there's an accepted Solicitud between sender and receiver
    const acceptedSolicitud = await Solicitud.findOne({
      $or: [
        { clientId: sender, technicianId: receiver, status: { $in: ['assigned', 'in-process', 'completed'] } },
        { clientId: receiver, technicianId: sender, status: { $in: ['assigned', 'in-process', 'completed'] } },
      ],
    });

    if (!acceptedSolicitud) {
      return res.status(403).json({ message: 'No tienes una solicitud aceptada con este usuario para poder enviar mensajes.' });
    }

    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();
    
    // Populate both sender and receiver info to send in the socket event
    const populatedMessage = await newMessage.populate([
      { path: 'sender', select: 'name avatar' },
      { path: 'receiver', select: 'name avatar' }
    ]);

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
    }).populate('sender', 'name avatar').populate('receiver', 'name avatar').sort('timestamp');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    // Delete all messages between the two users
    const result = await Message.deleteMany({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    });

    res.status(200).json({ 
      message: 'Conversación eliminada exitosamente',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};