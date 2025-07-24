import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Paperclip, Image, X, ChevronLeft, Phone, Video } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'technician';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
    size?: number;
  }[];
}

interface Conversation {
  id: string;
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'busy';
    lastSeen?: Date;
    role: 'client' | 'technician';
  };
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId?: string;
  onSendMessage: (conversationId: string, content: string, attachments?: File[]) => void;
  onConversationSelect: (conversationId: string) => void;
  currentUserId: string;
  currentUserRole: 'client' | 'technician';
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSendMessage,
  onConversationSelect,
  currentUserId,
  currentUserRole,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showConversationList, setShowConversationList] = useState(!activeConversationId);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messageEndRef.current && !showConversationList) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages, showConversationList]);

  // Handle sending a message
  const handleSendMessage = () => {
    if ((!message.trim() && attachments.length === 0) || !activeConversationId) return;
    
    onSendMessage(activeConversationId, message, attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...fileArray]);
    }
  };

  // Handle removing an attachment
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message groups
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = message.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date: new Date(date),
      messages,
    }));
  };

  // Render conversation list
  const renderConversationList = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold">Mensajes</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 p-4">
            <MessageCircle className="h-12 w-12 mb-2 text-neutral-300" />
            <p className="text-center">No tienes conversaciones activas</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className="p-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                onClick={() => {
                  onConversationSelect(conversation.id);
                  setShowConversationList(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar 
                      src={conversation.recipient.avatar} 
                      alt={conversation.recipient.name}
                      size="md"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${conversation.recipient.status === 'online' ? 'bg-success-500' : conversation.recipient.status === 'busy' ? 'bg-danger-500' : 'bg-neutral-300'}`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{conversation.recipient.name}</h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-neutral-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    {conversation.lastMessage && (
                      <p className="text-sm text-neutral-600 truncate">
                        {conversation.lastMessage.sender === (currentUserRole === 'client' ? 'user' : 'technician') && 'Tú: '}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <Badge variant="primary" size="sm" className="ml-2">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render active conversation
  const renderConversation = () => {
    if (!activeConversation) return null;
    
    const messageGroups = groupMessagesByDate(activeConversation.messages);
    
    return (
      <div className="h-full flex flex-col">
        {/* Conversation header */}
        <div className="p-3 border-b border-neutral-200 flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setShowConversationList(true)}
            aria-label="Volver a la lista de conversaciones"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Avatar 
              src={activeConversation.recipient.avatar} 
              alt={activeConversation.recipient.name}
              size="sm"
            />
            <span 
              className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white ${activeConversation.recipient.status === 'online' ? 'bg-success-500' : activeConversation.recipient.status === 'busy' ? 'bg-danger-500' : 'bg-neutral-300'}`}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{activeConversation.recipient.name}</h3>
            <p className="text-xs text-neutral-500">
              {activeConversation.recipient.status === 'online' 
                ? 'En línea' 
                : activeConversation.recipient.status === 'busy'
                ? 'Ocupado'
                : activeConversation.recipient.lastSeen 
                ? `Última vez ${formatTime(activeConversation.recipient.lastSeen)}` 
                : 'Desconectado'}
            </p>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-neutral-600 hover:text-primary-500"
              aria-label="Llamada de voz"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-neutral-600 hover:text-primary-500"
              aria-label="Videollamada"
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              <div className="flex justify-center">
                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                  {formatMessageDate(group.date)}
                </span>
              </div>
              
              {group.messages.map((msg, msgIndex) => {
                const isUser = msg.sender === (currentUserRole === 'client' ? 'user' : 'technician');
                const showAvatar = msgIndex === 0 || 
                  group.messages[msgIndex - 1].sender !== msg.sender;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] items-end gap-2`}>
                      {!isUser && showAvatar ? (
                        <Avatar 
                          src={activeConversation.recipient.avatar} 
                          alt={activeConversation.recipient.name}
                          size="xs"
                        />
                      ) : !isUser ? <div className="w-6" /> : null}
                      
                      <div className={`space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`rounded-lg p-3 ${isUser 
                            ? 'bg-primary-500 text-white rounded-br-none' 
                            : 'bg-neutral-100 text-neutral-800 rounded-bl-none'}`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {msg.attachments.map(attachment => (
                                <div 
                                  key={attachment.id}
                                  className={`rounded p-2 text-xs flex items-center ${isUser ? 'bg-primary-600' : 'bg-neutral-200'}`}
                                >
                                  {attachment.type === 'image' ? (
                                    <div className="relative w-full h-32 rounded overflow-hidden">
                                      <img 
                                        src={attachment.url} 
                                        alt={attachment.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <Paperclip className="h-4 w-4" />
                                      <span className="flex-1 truncate">{attachment.name}</span>
                                      {attachment.size && (
                                        <span>{Math.round(attachment.size / 1024)} KB</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex text-xs text-neutral-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {isUser && (
                            <span className="ml-1">
                              {msg.status === 'read' ? 'Leído' : msg.status === 'delivered' ? 'Entregado' : 'Enviado'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        
        {/* Attachment preview */}
        {attachments.length > 0 && (
          <div className="p-2 border-t border-neutral-200 bg-neutral-50">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div 
                  key={index}
                  className="relative bg-white border border-neutral-200 rounded p-2 text-xs flex items-center"
                >
                  {file.type.startsWith('image/') ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <Button
                        variant="danger"
                        size="xs"
                        className="absolute top-0 right-0 p-0 h-5 w-5 rounded-full"
                        onClick={() => handleRemoveAttachment(index)}
                        aria-label="Eliminar archivo"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 pr-6">
                      <Paperclip className="h-4 w-4" />
                      <span className="max-w-[100px] truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="absolute top-1 right-1 p-0 h-4 w-4 text-neutral-500"
                        onClick={() => handleRemoveAttachment(index)}
                        aria-label="Eliminar archivo"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Message input */}
        <div className="p-3 border-t border-neutral-200">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full"
                multiline
                maxRows={4}
              />
            </div>
            
            <div className="flex space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
              />
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-neutral-600"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Adjuntar archivo"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-neutral-600"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'image/*';
                    fileInputRef.current.click();
                  }
                }}
                aria-label="Adjuntar imagen"
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="p-2"
                onClick={handleSendMessage}
                disabled={!message.trim() && attachments.length === 0}
                aria-label="Enviar mensaje"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
    >
      <div className="h-full">
        {showConversationList ? renderConversationList() : renderConversation()}
      </div>
    </Drawer>
  );
};

// Chat button component
interface ChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
  variant?: 'ghost' | 'outline' | 'subtle' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  unreadCount = 0,
  variant = 'ghost',
  size = 'md',
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`relative ${className}`}
      aria-label="Chat"
    >
      <MessageCircle className={size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'} />
      {unreadCount > 0 && (
        <Badge 
          variant="danger" 
          size="sm" 
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
};

// Example usage component
export const ChatExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      recipient: {
        id: 'tech1',
        name: 'Juan Pérez',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        status: 'online',
        role: 'technician',
      },
      messages: [
        {
          id: '1',
          content: 'Hola, ¿cómo puedo ayudarte con tu problema de plomería?',
          sender: 'technician',
          timestamp: new Date(Date.now() - 3600000 * 24),
          status: 'read',
        },
        {
          id: '2',
          content: 'Tengo una fuga en el baño, el agua sale por debajo del inodoro.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000 * 23),
          status: 'read',
        },
        {
          id: '3',
          content: 'Entiendo. ¿Podrías enviarme una foto del problema?',
          sender: 'technician',
          timestamp: new Date(Date.now() - 3600000 * 22),
          status: 'read',
        },
        {
          id: '4',
          content: 'Aquí está la foto',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000 * 21),
          status: 'read',
          attachments: [
            {
              id: 'att1',
              type: 'image',
              url: 'https://plumbingtoday.biz/images/blog/toilet-leaking-from-bottom.jpg',
              name: 'fuga_inodoro.jpg',
              size: 245000,
            },
          ],
        },
        {
          id: '5',
          content: 'Gracias. Parece que necesitas reemplazar el sello de cera. Puedo visitarte mañana a las 10 AM. ¿Te parece bien?',
          sender: 'technician',
          timestamp: new Date(Date.now() - 3600000 * 20),
          status: 'read',
        },
      ],
      unreadCount: 0,
      lastMessage: {
        id: '5',
        content: 'Gracias. Parece que necesitas reemplazar el sello de cera. Puedo visitarte mañana a las 10 AM. ¿Te parece bien?',
        sender: 'technician',
        timestamp: new Date(Date.now() - 3600000 * 20),
        status: 'read',
      },
    },
    {
      id: '2',
      recipient: {
        id: 'tech2',
        name: 'María Rodríguez',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        status: 'offline',
        lastSeen: new Date(Date.now() - 3600000 * 2),
        role: 'technician',
      },
      messages: [
        {
          id: '1',
          content: 'Buenas tardes, ¿en qué puedo ayudarte?',
          sender: 'technician',
          timestamp: new Date(Date.now() - 3600000 * 5),
          status: 'read',
        },
        {
          id: '2',
          content: 'Necesito ayuda con la instalación de un aire acondicionado',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000 * 4),
          status: 'read',
        },
      ],
      unreadCount: 1,
      lastMessage: {
        id: '3',
        content: 'Claro, puedo ayudarte con eso. ¿Qué tipo de aire acondicionado tienes?',
        sender: 'technician',
        timestamp: new Date(Date.now() - 3600000 * 1),
        status: 'delivered',
      },
    },
  ]);

  // Handle sending a message
  const handleSendMessage = (conversationId: string, content: string, attachments?: File[]) => {
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === conversationId) {
          const newMessage: Message = {
            id: Date.now().toString(),
            content,
            sender: 'user',
            timestamp: new Date(),
            status: 'sent',
            attachments: attachments ? attachments.map(file => ({
              id: Math.random().toString(36).substring(2),
              type: file.type.startsWith('image/') ? 'image' : 'document',
              url: URL.createObjectURL(file),
              name: file.name,
              size: file.size,
            })) : undefined,
          };
          
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
            unreadCount: 0, // Reset unread count for the active conversation
          };
        }
        return conv;
      });
    });
  };

  // Handle selecting a conversation
  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    // Mark conversation as read
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
          };
        }
        return conv;
      });
    });
  };

  // Calculate total unread messages
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ejemplo de Chat</h1>
      
      <ChatButton 
        onClick={() => setIsOpen(true)} 
        unreadCount={totalUnreadCount}
        variant="primary"
      />
      
      <ChatDrawer 
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          // Reset to conversation list when closing
          if (!activeConversationId) {
            setActiveConversationId(undefined);
          }
        }}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSendMessage={handleSendMessage}
        onConversationSelect={handleConversationSelect}
        currentUserId="user1"
        currentUserRole="client"
      />
    </div>
  );
};

export default ChatDrawer;