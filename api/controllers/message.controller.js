import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user.id; // Assuming req.user.id is set by auth middleware

    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
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