import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { Footer } from '../components/layout/Footer';
import { Send, ArrowLeftCircle } from 'lucide-react';

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  receiver: { _id: string; name: string; avatar?: string };
  content: string;
  timestamp: string;
}

export const Chat = () => {
  const { otherUserId } = useParams<{ otherUserId: string; serviceRequestId: string }>();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [otherUserName, setOtherUserName] = useState('');

  // Separate useEffect for fetching initial data
  useEffect(() => {
    if (!user || !otherUserId) return;

    const fetchOtherUserName = async () => {
      try {
        const otherUser = await userService.getUserById(otherUserId);
        setOtherUserName(otherUser.name);
      } catch (error) {
        console.error('Error fetching other user name:', error);
        setOtherUserName('Usuario Desconocido');
      }
    };
    fetchOtherUserName();

    const fetchMessages = async () => {
      try {
        const messages = await messageService.getMessages(otherUserId);
        setMessages(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [user, otherUserId]);

  // Separate useEffect for socket management
  useEffect(() => {
    console.log('Socket useEffect triggered:', { socket: !!socket, user: !!user, otherUserId });
    if (!socket || !user || !otherUserId) return;

    const currentUserId = user._id || user.id;
    console.log('User object:', user);
    console.log('Current user ID:', currentUserId);
    
    if (!currentUserId) {
      console.error('User ID not found:', user);
      return;
    }

    const roomId = [currentUserId, otherUserId].sort().join('--');
    
    // Join the chat room
    socket.emit('joinRoom', roomId);
    console.log(`🚀 Joined chat room: ${roomId}`, { currentUserId, otherUserId });
    console.log('🔌 Socket connected:', socket.connected);
    console.log('🎯 Socket ID:', socket.id);

    // Handle new messages
    const handleNewMessage = (message: Message) => {
      console.log('🔥 NEW MESSAGE EVENT RECEIVED:', message);
      console.log('🔍 Current chat context:', { currentUserId, otherUserId });
      console.log('🔍 Message participants:', { senderId: message.sender._id, receiverId: message.receiver._id });
      
      // Only add message if it's relevant to the current chat
      if (
        (message.sender._id === currentUserId && message.receiver._id === otherUserId) ||
        (message.sender._id === otherUserId && message.receiver._id === currentUserId)
      ) {
        console.log('✅ Message is relevant to current chat, adding to messages');
        setMessages((prevMessages) => {
          // Check if message already exists to avoid duplicates
          const messageExists = prevMessages.some(msg => msg._id === message._id);
          if (messageExists) {
            console.log('⚠️ Message already exists, skipping');
            return prevMessages;
          }
          console.log('✅ Adding new message to chat');
          return [...prevMessages, message];
        });
      } else {
        console.log('❌ Message not relevant to current chat, ignoring');
      }
    };

    socket.on('newMessage', handleNewMessage);
    console.log('👂 Listening for newMessage events on socket:', socket.id);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveRoom', roomId);
      console.log(`👋 Left chat room: ${roomId}`);
    };
  }, [socket, user, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !otherUserId) return;

    try {
      await messageService.sendMessage(otherUserId, newMessage.trim());
      // The message will be added via socket.on('newMessage') for real-time update
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.message || 'Error al enviar el mensaje';
      showToast(errorMessage, 'error');
    }
  };

  if (!user) {
    return <p>Loading user...</p>; // Or navigate to login
  }

  return (
    <div className="flex flex-col min-h-screen bg--50">
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="mr-2 p-2 rounded-full hover:bg-gray-200">
            <ArrowLeftCircle className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chat con {otherUserName}</h1>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender._id === (user._id || user.id) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${msg.sender._id === (user._id || user.id)
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="font-semibold">{msg.sender._id === (user._id || user.id) ? 'Tú' : msg.sender.name}</p>
                <p>{msg.content}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center bg-white rounded-lg shadow-md p-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};
