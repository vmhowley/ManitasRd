import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from './AuthContext';

interface IFirebaseRealtimeContext {
  // Real-time listeners for different data types
  subscribeToServiceRequests: (callback: (requests: any[]) => void) => () => void;
  subscribeToMessages: (conversationId: string, callback: (messages: any[]) => void) => () => void;
  subscribeToUserNotifications: (userId: string, callback: (notifications: any[]) => void) => () => void;
}

const FirebaseRealtimeContext = createContext<IFirebaseRealtimeContext>({
  subscribeToServiceRequests: () => () => {},
  subscribeToMessages: () => () => {},
  subscribeToUserNotifications: () => () => {}
});

// Backward compatibility - keep the same hook name
export const useSocket = () => {
  return useContext(FirebaseRealtimeContext);
};

// For new usage, provide a more descriptive hook name
export const useFirebaseRealtime = () => {
  return useContext(FirebaseRealtimeContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Subscribe to service requests in real-time
  const subscribeToServiceRequests = useCallback((callback: (requests: any[]) => void) => {
    if (!user) return () => {};

    let q;
    if (user.type === 'technician') {
      // Technicians see pending requests
      q = query(
        collection(db, 'serviceRequests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Clients see their own requests
      q = query(
        collection(db, 'serviceRequests'),
        where('clientId', '==', user._id),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        ...doc.data(),
        _id: doc.id
      }));
      callback(requests);
    }, (error) => {
      console.error('Error listening to service requests:', error);
    });

    return unsubscribe;
  }, [user]);

  // Subscribe to messages in real-time
  const subscribeToMessages = useCallback((conversationId: string, callback: (messages: any[]) => void) => {
    if (!conversationId) return () => {};

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        ...doc.data(),
        _id: doc.id
      }));
      callback(messages);
    }, (error) => {
      console.error('Error listening to messages:', error);
    });

    return unsubscribe;
  }, []);

  // Subscribe to user notifications (can be extended for future use)
  const subscribeToUserNotifications = useCallback((userId: string, callback: (notifications: any[]) => void) => {
    if (!userId) return () => {};

    // This can be implemented when notification system is added
    // For now, return empty function
    return () => {};
  }, []);

  const contextValue = {
    subscribeToServiceRequests,
    subscribeToMessages,
    subscribeToUserNotifications
  };

  return (
    <FirebaseRealtimeContext.Provider value={contextValue}>
      {children}
    </FirebaseRealtimeContext.Provider>
  );
};
