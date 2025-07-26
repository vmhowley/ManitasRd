import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search, Menu, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';
import type { User } from '../types/User';
import { getAvatarUrl } from '../utils/avatarUtils';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  receiver: { _id: string; name: string; avatar?: string };
  content: string;
  timestamp: string;
}

export const Messaging = () => {
  const { user, serviceRequests } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorChats, setErrorChats] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch available chat contacts
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        setLoadingChats(true);
        const users = await userService.getChatContacts();
        setAllUsers(users.filter((u: User) => u._id !== user._id));
      } catch (err) {
        console.error('Error fetching users:', err);
        setErrorChats('Failed to load users for chat.');
      } finally {
        setLoadingChats(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  // Fetch messages when a chat user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !selectedChatUser) return;
      
      try {
        setLoadingMessages(true);
        const fetchedMessages = await messageService.getMessages(selectedChatUser._id);
        setMessages(fetchedMessages);
        // Scroll to bottom after loading messages (without smooth animation to avoid focus issues)
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
        }, 100);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setErrorMessages('Failed to load messages.');
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [selectedChatUser, user]);

  // Socket management for real-time messaging
  useEffect(() => {
    console.log('Socket useEffect triggered:', { socket: !!socket, user: !!user, selectedChatUser: !!selectedChatUser });
    if (!socket || !user || !selectedChatUser) return;

    const currentUserId = user._id || user.id;
    console.log('User object:', user);
    console.log('Current user ID:', currentUserId);
    
    if (!currentUserId) {
      console.error('User ID not found:', user);
      return;
    }

    const roomId = [currentUserId, selectedChatUser._id].sort().join('--');
    
    // Join the chat room
    socket.emit('joinRoom', roomId);
    console.log(`🚀 Joined chat room: ${roomId}`, { currentUserId, selectedUserId: selectedChatUser._id });
    console.log('🔌 Socket connected:', socket.connected);
    console.log('🎯 Socket ID:', socket.id);

    // Handle new messages
    const handleNewMessage = (message: Message) => {
      console.log('🔥 NEW MESSAGE EVENT RECEIVED:', message);
      console.log('🔍 Current chat context:', { currentUserId, selectedUserId: selectedChatUser._id });
      console.log('🔍 Message participants:', { senderId: message.sender._id, receiverId: message.receiver._id });
      
      // Only add message if it's relevant to the current chat
      if (
        (message.sender._id === currentUserId && message.receiver._id === selectedChatUser._id) ||
        (message.sender._id === selectedChatUser._id && message.receiver._id === currentUserId)
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
           setShouldScrollToBottom(true); // Trigger scroll for new messages
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
  }, [socket, user, selectedChatUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldScrollToBottom && !loadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldScrollToBottom(false); // Reset the flag
    }
  }, [shouldScrollToBottom, loadingMessages]);

  // State for tracking window width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChatUser || !user) return;

    try {
      await messageService.sendMessage(selectedChatUser._id, message.trim());
      // The message will be added via socket.on('newMessage') for real-time update
      setMessage('');
      setShouldScrollToBottom(true); // Scroll after sending message
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.message || 'Error al enviar el mensaje';
      showToast(errorMessage, 'error');
      setErrorMessages(errorMessage);
    }
  };

  // Handle deleting a conversation
  const handleDeleteConversation = async (userId: string) => {
    try {
      // Call backend to delete conversation
      await messageService.deleteConversation(userId);
      
      // Remove user from the chat list
      setAllUsers(prev => prev.filter(u => u._id !== userId));
      
      // If the deleted conversation was active, reset active conversation
      if (selectedChatUser?._id === userId) {
        setSelectedChatUser(null);
        setMessages([]);
      }
      
      showToast('Conversación eliminada', 'success');
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      showToast('Error al eliminar la conversación', 'error');
    }
  };

  // Auto-delete conversations for completed/cancelled services
  useEffect(() => {
    if (!serviceRequests || serviceRequests.length === 0) return;

    const completedOrCancelledServices = serviceRequests.filter(
      service => service.status === 'completed' || service.status === 'cancelled'
    );

    if (completedOrCancelledServices.length > 0) {
      const timer = setTimeout(() => {
        completedOrCancelledServices.forEach(service => {
           // Find the technician associated with this service
           const technicianId = service.technicianId?._id;
           if (technicianId) {
             handleDeleteConversation(technicianId);
             console.log(`Auto-deleted conversation for ${service.status} service:`, service._id);
           }
         });
        
        if (completedOrCancelledServices.length > 0) {
          showToast(`Se eliminaron ${completedOrCancelledServices.length} conversación(es) de servicios finalizados`, 'info');
        }
      }, 5000); // Delete after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [serviceRequests]);

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.specialties && u.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    u.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header unificado y mejorado */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navegación principal */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => selectedChatUser && !isDesktop ? setSelectedChatUser(null) : navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors group"
                aria-label={selectedChatUser && !isDesktop ? 'Volver a la lista' : 'Volver'}
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:transform group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline font-medium">
                  {selectedChatUser && !isDesktop ? 'Conversaciones' : 'Volver'}
                </span>
              </button>
              
              {/* Título dinámico unificado */}
              {selectedChatUser ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={getAvatarUrl(selectedChatUser.name)}
                    alt={selectedChatUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="relative">
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">{selectedChatUser.name}</h1>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedChatUser.type === 'technician' ? 'Técnico' : 'Cliente'}
                      </span>
                      <span className="text-green-600 font-medium">En línea</span>
                    </div>
                  </div>
                </div>
              ) : (
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Mensajes</h1>
              )}
            </div>
            
            {/* Acciones del header unificadas */}
            <div className="flex items-center space-x-2">
              {/* Acciones de chat cuando hay usuario seleccionado */}
              {selectedChatUser && (
                <>
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Llamar"
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Videollamada"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    aria-label="Más opciones"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* Botón de menú móvil */}
              {!selectedChatUser && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="flex h-full bg-white shadow-lg md:rounded-lg overflow-hidden relative">
          {/* Mobile Overlay */}
          {isMobileMenuOpen && !selectedChatUser && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* Chat List Sidebar mejorado */}
          <div className={`
            ${(isMobileMenuOpen && !selectedChatUser) || !selectedChatUser ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 
            ${selectedChatUser ? 'hidden md:flex' : 'flex'}
            fixed md:relative 
            top-0 left-0 
            w-full sm:w-80 md:w-1/3 lg:w-1/4 xl:w-1/3
            h-full md:h-auto 
            border-r border-gray-200 
            flex-col 
            bg-white 
            z-50 md:z-auto
            transition-all duration-300 ease-in-out
            shadow-xl md:shadow-none
          `}>
            {/* Búsqueda mejorada */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {loadingChats ? (
                <div className="p-4 text-center text-gray-500">Cargando usuarios...</div>
              ) : errorChats ? (
                <div className="p-4 text-center text-red-500">{errorChats}</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-3 sm:p-4 text-center text-gray-500">
                  <div className="mb-2 text-sm sm:text-base">📝 No hay contactos disponibles</div>
                  <div className="text-xs sm:text-sm px-2">
                    Solo puedes chatear con {user?.type === 'technician' ? 'clientes que hayan aceptado tus servicios' : 'técnicos que hayan aceptado tus solicitudes'}
                  </div>
                </div>
              ) : (
                filteredUsers.map((chatUser) => (
                  <div
                    key={chatUser._id}
                    className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group ${
                      selectedChatUser?._id === chatUser._id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="flex items-start space-x-3 flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedChatUser(chatUser);
                          setIsMobileMenuOpen(false); // Close mobile menu when selecting a chat
                        }}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={getAvatarUrl(chatUser.name)}
                            alt={chatUser.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium sm:font-semibold text-gray-900 truncate text-sm sm:text-base">{chatUser.name}</h3>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {chatUser.type === 'technician' ? 'Técnico' : 'Cliente'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(chatUser._id);
                        }}
                        className="opacity-60 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
                        aria-label="Eliminar conversación"
                        title="Eliminar conversación"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedChatUser ? (
              <>
                {/* Header eliminado - toda la información está en el header principal */}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
                  {loadingMessages ? (
                    <div className="text-center text-gray-500 text-sm sm:text-base">Cargando mensajes...</div>
                  ) : errorMessages ? (
                    <div className="text-center text-red-500 text-sm sm:text-base px-4">{errorMessages}</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm sm:text-base px-4">No hay mensajes en esta conversación.</div>
                  ) : (
                    messages.map((msg: Message) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender._id === (user?._id || user?.id) ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                            msg.sender._id === (user?._id || user?.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 shadow-sm'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender._id === (user?._id || user?.id) ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                  {/* Padding inferior para evitar que el scroll llegue al footer */}
                  <div className="h-4 sm:h-6"></div>
                </div>

                {/* Message Input */}
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="p-2 sm:p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Estado vacío mejorado */
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                <div className="text-center max-w-md mx-auto">
                  {/* Botón de menú móvil mejorado */}
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden mb-8 p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    aria-label="Ver conversaciones"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  
                  {/* Icono mejorado */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Send className="h-10 w-10 text-blue-600" />
                  </div>
                  
                  {/* Contenido mejorado */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    ¡Comienza a conversar!
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    <span className="md:hidden">
                      Toca el botón de menú arriba para ver tus conversaciones disponibles
                    </span>
                    <span className="hidden md:inline">
                      Selecciona una conversación de la lista lateral para comenzar a chatear con tus contactos
                    </span>
                  </p>
                  
                  {/* Indicador visual adicional en desktop */}
                  <div className="hidden md:flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Esperando selección...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};