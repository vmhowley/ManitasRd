import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  getDocs, 
  doc,
  setDoc,
  getDoc,
  Timestamp,
  type QuerySnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Types
export interface FirestoreMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  chatId: string;
  senderName?: string;
  receiverName?: string;
}

export interface FirestoreUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  userType?: string;
}

export type MessageListener = (messages: FirestoreMessage[]) => void;

class FirestoreService {
  // User management methods
  async createOrUpdateUser(user: FirestoreUser): Promise<void> {
    try {
      await setDoc(doc(db, 'users', user.id), user, { merge: true });
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<FirestoreUser | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Send a new message
  async sendMessage(message: Omit<FirestoreMessage, 'id' | 'timestamp'>): Promise<void> {
    try {
      await addDoc(collection(db, 'messages'), {
        ...message,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages for a chat (one-time fetch)
  async getMessages(chatId: string): Promise<FirestoreMessage[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirestoreMessage));
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Subscribe to real-time messages for a chat
  subscribeToMessages(chatId: string, callback: MessageListener): Unsubscribe {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const messages: FirestoreMessage[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirestoreMessage));
      
      callback(messages);
    }, (error) => {
      console.error('Error in message subscription:', error);
    });
  }

  // Get all chat contacts for a user
  async getChatContacts(userId: string): Promise<FirestoreUser[]> {
    try {
      // Get messages where user is sender
      const sentQuery = query(
        collection(db, 'messages'),
        where('senderId', '==', userId)
      );
      
      // Get messages where user is receiver
      const receivedQuery = query(
        collection(db, 'messages'),
        where('receiverId', '==', userId)
      );
      
      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);
      
      const contactIds = new Set<string>();
      
      // Add receivers from sent messages
      sentSnapshot.docs.forEach(doc => {
        const data = doc.data();
        contactIds.add(data.receiverId);
      });
      
      // Add senders from received messages
      receivedSnapshot.docs.forEach(doc => {
        const data = doc.data();
        contactIds.add(data.senderId);
      });
      
      // Fetch user details for each contact
      const contacts: FirestoreUser[] = [];
      for (const contactId of contactIds) {
        const user = await this.getUser(contactId);
        if (user) {
          contacts.push(user);
        }
      }
      
      return contacts;
    } catch (error) {
      console.error('Error getting chat contacts:', error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService;