import React, { useState } from 'react';
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { User } from '../App';

interface MessagingPageProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  type: 'client' | 'technician';
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export default function MessagingPage({ user, onNavigate }: MessagingPageProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    onNavigate('login');
    return null;
  }

  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Carlos Mendoza',
      avatar: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      lastMessage: 'Perfecto, estaré allí a las 2 PM',
      timestamp: '10:30 AM',
      unread: 2,
      online: true,
      type: user.type === 'client' ? 'technician' : 'client'
    },
    {
      id: '2',
      name: 'Ana Rodríguez',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      lastMessage: '¿Podrías enviarme una foto del problema?',
      timestamp: 'Ayer',
      unread: 0,
      online: false,
      type: user.type === 'client' ? 'technician' : 'client'
    },
    {
      id: '3',
      name: 'Miguel Torres',
      avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      lastMessage: 'Gracias por el excelente servicio',
      timestamp: '2 días',
      unread: 0,
      online: true,
      type: user.type === 'client' ? 'technician' : 'client'
    }
  ];

  const mockMessages: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        senderId: user.type === 'client' ? '1' : user.id,
        content: 'Hola, necesito ayuda con un problema de plomería',
        timestamp: '9:00 AM',
        type: 'text'
      },
      {
        id: '2',
        senderId: user.type === 'client' ? user.id : '1',
        content: 'Por supuesto, ¿podrías describir el problema?',
        timestamp: '9:05 AM',
        type: 'text'
      },
      {
        id: '3',
        senderId: user.type === 'client' ? '1' : user.id,
        content: 'Tengo una fuga en la tubería del baño principal',
        timestamp: '9:10 AM',
        type: 'text'
      },
      {
        id: '4',
        senderId: user.type === 'client' ? user.id : '1',
        content: 'Entiendo. Puedo ir hoy a las 2 PM. ¿Te parece bien?',
        timestamp: '9:15 AM',
        type: 'text'
      },
      {
        id: '5',
        senderId: user.type === 'client' ? '1' : user.id,
        content: 'Perfecto, estaré allí a las 2 PM',
        timestamp: '10:30 AM',
        type: 'text'
      }
    ]
  };

  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);
  const messages = selectedChat ? mockMessages[selectedChat] || [] : [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    // In a real app, this would send the message to the backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => onNavigate(user.type === 'client' ? 'client-dashboard' : 'technician-dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al dashboard
            </button>
            <h1 className="ml-6 text-xl font-semibold text-gray-900">Mensajes</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Chat List */}
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
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat === chat.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{chat.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChatData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedChatData.avatar}
                          alt={selectedChatData.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {selectedChatData.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedChatData.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedChatData.online ? 'En línea' : 'Desconectado'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.senderId === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Escribe un mensaje..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="absolute right-3 top-2 p-1 text-gray-600 hover:text-blue-600 transition-colors">
                          <Smile className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
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
    </div>
  );
}