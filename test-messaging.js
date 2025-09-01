// Test script to add sample users and messages to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyDvQVlqsJlBxQyQVlqsJlBxQyQVlqsJlBxQy",
  authDomain: "manitasrd-chat.firebaseapp.com",
  projectId: "manitasrd-chat",
  storageBucket: "manitasrd-chat.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestData() {
  try {
    console.log('Adding test users...');
    
    // Add test users
    await setDoc(doc(db, 'users', 'user1'), {
      id: 'user1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      type: 'client'
    });
    
    await setDoc(doc(db, 'users', 'user2'), {
      id: 'user2',
      name: 'María García',
      email: 'maria@example.com',
      type: 'technician'
    });
    
    console.log('Test users added successfully');
    
    // Add a test message
    console.log('Adding test message...');
    
    const chatId = ['user1', 'user2'].sort().join('_');
    
    await addDoc(collection(db, 'messages'), {
      senderId: 'user1',
      receiverId: 'user2',
      senderName: 'Juan Pérez',
      receiverName: 'María García',
      content: 'Hola, necesito ayuda con mi plomería',
      chatId: chatId,
      timestamp: new Date()
    });
    
    console.log('Test message added successfully');
    console.log('Test data setup complete!');
    
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

// Run the test
addTestData();