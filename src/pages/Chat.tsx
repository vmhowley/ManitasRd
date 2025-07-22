import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messageService } from '../services/messageService';
import { Header } from '../components/layout/Header';
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
  const { otherUserId, serviceRequestId } = useParams<{ otherUserId: string; serviceRequestId: string }>();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [otherUserName, setOtherUserName] = useState('');

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
        const response = await messageService.getMessages(otherUserId);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    if (socket) {
      socket.on('newMessage', (message: Message) => {
        // Only add message if it's relevant to the current chat
        if (
          (message.sender._id === user._id && message.receiver._id === otherUserId) ||
          (message.sender._id === otherUserId && message.receiver._id === user._id)
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [user, otherUserId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !otherUserId) return;

    try {
      const messageToSend = {
        receiver: otherUserId,
        content: newMessage,
      };
      const response = await messageService.sendMessage(messageToSend);
      // The message will be added via socket.on('newMessage') for real-time update
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error, e.g., show a toast notification
    }
  };

  if (!user) {
    return <p>Loading user...</p>; // Or navigate to login
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
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
              className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${msg.sender._id === user._id
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="font-semibold">{msg.sender.name}</p>
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
