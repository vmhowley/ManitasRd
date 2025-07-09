import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Smile, Search, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';
import type { User } from '../types/User';
import { getAvatarUrl } from '../utils/avatarUtils';
import { useSocket } from '../context/SocketContext'; // Import the socket hook

interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
}

export const Messaging = () => {
  const { user } = useAuth();
  const { socket } = useSocket(); // Use the socket
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorChats, setErrorChats] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Effect for listening to new messages
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (incomingMessage: any) => {
      // The incoming message from the socket has the sender populated, but the receiver is just an ID string.
      // We need to check if this message belongs to the currently active chat window.
      const isMessageForActiveChat = selectedChatUser &&
        ((incomingMessage.sender._id === user._id && incomingMessage.receiver === selectedChatUser._id) || // Message sent by me to the selected user
         (incomingMessage.sender._id === selectedChatUser._id && incomingMessage.receiver === user._id));   // Message received from the selected user

      if (isMessageForActiveChat) {
        // To ensure consistency in our state, we format the incoming socket message
        // to match the 'Message' type used throughout the component.
        const formattedMessage: Message = {
          _id: incomingMessage._id,
          content: incomingMessage.content,
          timestamp: incomingMessage.timestamp,
          // The sender of the incoming message is populated by the backend.
          // The receiver needs to be a full User object, not just an ID.
          sender: incomingMessage.sender,
          receiver: selectedChatUser, // The other user in the chat is the receiver.
        };
        
        // If the message was sent by the current user, the sender object should be the user's object
        if (incomingMessage.sender._id === user._id) {
            formattedMessage.sender = user;
        }


        setCurrentChatMessages((prevMessages) => {
          // Avoid adding duplicate messages that might already be in the state
          if (prevMessages.some(msg => msg._id === formattedMessage._id)) {
            return prevMessages;
          }
          return [...prevMessages, formattedMessage];
        });
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedChatUser, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingChats(true);
        const users = await userService.getTechnicians();
        setAllUsers(users.filter((u: User) => u._id !== user?._id));
      } catch (err) {
        console.error('Error fetching users:', err);
        setErrorChats('Failed to load users for chat.');
      } finally {
        setLoadingChats(false);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user && selectedChatUser) {
        try {
          setLoadingMessages(true);
          const messages = await messageService.getMessages(selectedChatUser._id);
          setCurrentChatMessages(messages.data);
        } catch (err) {
          console.error('Error fetching messages:', err);
          setErrorMessages('Failed to load messages.');
        } finally {
          setLoadingMessages(false);
        }
      } else {
        setCurrentChatMessages([]);
      }
    };
    fetchMessages();
  }, [selectedChatUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChatUser || !user) return;

    try {
      // The message will be added to the state via the socket event, so no need to add it here.
      await messageService.sendMessage(selectedChatUser._id, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessages('Failed to send message.');
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    u.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Mensajes</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="flex h-full bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {loadingChats ? (
                <div className="p-4 text-center text-gray-500">Cargando usuarios...</div>
              ) : errorChats ? (
                <div className="p-4 text-center text-red-500">{errorChats}</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No se encontraron usuarios para chatear
                </div>
              ) : (
                <>
                  {filteredUsers.map((chatUser) => (
                    <div
                      key={chatUser._id}
                      onClick={() => setSelectedChatUser(chatUser)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChatUser?._id === chatUser._id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <img
                            src={getAvatarUrl(chatUser.name)}
                            alt={chatUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {/* {chatUser.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )} */}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{chatUser.name}</h3>
                            {/* <span className="text-xs text-gray-500">{chatUser.timestamp}</span> */}
                          </div>
                          
                          {chatUser.type === 'technician' && (
                            <div className="flex items-center mb-1">
                              <span className="text-sm text-blue-600 mr-2">{chatUser.specialties?.join(', ')}</span>
                              {chatUser.rating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600 ml-1">{chatUser.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{chatUser.lastMessage}</p>
                            {chatUser.unread > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {chatUser.unread}
                              </span>
                            )}
                          </div> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChatUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={getAvatarUrl(selectedChatUser.name)}
                          alt={selectedChatUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* {selectedChatUser.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )} */}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedChatUser.name}</h3>
                        {selectedChatUser.type === 'technician' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-600">{selectedChatUser.specialties?.join(', ')}</span>
                            {selectedChatUser.rating && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{selectedChatUser.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {loadingMessages ? (
                    <div className="text-center text-gray-500">Cargando mensajes...</div>
                  ) : errorMessages ? (
                    <div className="text-center text-red-500">{errorMessages}</div>
                  ) : currentChatMessages.length === 0 ? (
                    <div className="text-center text-gray-500">No hay mensajes en esta conversación.</div>
                  ) : (
                    currentChatMessages.map((msg: Message) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            msg.sender._id === user?._id
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 shadow-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender._id === user?._id ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Selecciona una conversación
                  </h3>
                  <p className="text-gray-600">
                    Elige una conversación de la lista para comenzar a chatear
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

