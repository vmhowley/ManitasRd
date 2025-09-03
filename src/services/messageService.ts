import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: any;
  conversationId: string;
}

export const messageService = {
  sendMessage: async (senderId: string, receiverId: string, content: string): Promise<Message> => {
    try {
      // Crear ID de conversación consistente
      const conversationId = [senderId, receiverId].sort().join('_');
      
      const messageData = {
        senderId,
        receiverId,
        content,
        conversationId,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'messages'), messageData);
      
      return {
        _id: docRef.id,
        ...messageData,
        createdAt: new Date()
      } as Message;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  getMessages: async (currentUserId: string, otherUserId: string): Promise<Message[]> => {
    try {
      const conversationId = [currentUserId, otherUserId].sort().join('_');
      
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          _id: doc.id
        } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Real-time listener para mensajes
  subscribeToMessages: (currentUserId: string, otherUserId: string, callback: (messages: Message[]) => void) => {
    const conversationId = [currentUserId, otherUserId].sort().join('_');
    
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          _id: doc.id
        } as Message);
      });
      callback(messages);
    });
  },
  listenToMessages: (chatId: string, callback: (messages: any[]) => void) => {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot: any) => {
      const messages: any[] = [];
      querySnapshot.forEach((doc: any) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(messages);
    });
  },
  deleteConversation: async (currentUserId: string, otherUserId: string): Promise<void> => {
    try {
      const conversationId = [currentUserId, otherUserId].sort().join('_');
      
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId)
      );

      const querySnapshot = await getDocs(q);
      
      // Eliminar todos los mensajes de la conversación
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },
};