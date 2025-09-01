import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { ServiceRequest } from '../types/ServiceRequest';

export interface ServiceRequestData {
  category: string;
  description: string;
  address: string;
  requestDate: string;
  preferredTime?: string;
  urgency: string;
  clientBudget?: number;
}

// Data for creating a standard, fixed-price service request
export interface StandardServiceRequestData {
  category: string;
  description: string;
  address: string;
  requestDate: string;
  finalPrice: number;
  serviceId: string;
  clientId: string;
}

export const serviceRequestService = {
  // Create a new standard service request
  createStandardRequest: async (data: StandardServiceRequestData): Promise<ServiceRequest> => {
    try {
      const requestData = {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'serviceRequests'), requestData);
      const newDoc = await getDoc(docRef);
      
      return {
        ...newDoc.data(),
        _id: newDoc.id
      } as ServiceRequest;
    } catch (error) {
      console.error('Error creating standard request:', error);
      throw error;
    }
  },

  // (The original function can be kept for other purposes or deprecated)
  submitServiceRequest: async (requestData: ServiceRequestData, userId: string): Promise<ServiceRequest> => {
    try {
      const requestDoc = {
        ...requestData,
        clientId: userId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'serviceRequests'), requestDoc);
      const newDoc = await getDoc(docRef);
      
      return {
        ...newDoc.data(),
        _id: newDoc.id
      } as ServiceRequest;
    } catch (error) {
      console.error('Error submitting service request:', error);
      throw error;
    }
  },

  // Get all requests for the logged-in user
  getRequests: async (userId?: string): Promise<ServiceRequest[]> => {
    try {
      let q;
      if (userId) {
        // Temporarily remove orderBy to avoid index requirement
        q = query(
          collection(db, 'serviceRequests'),
          where('clientId', '==', userId)
        );
      } else {
        q = query(
          collection(db, 'serviceRequests'),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const requests: ServiceRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({
          ...doc.data(),
          _id: doc.id
        } as ServiceRequest);
      });
      
      // Sort manually by createdAt if userId is provided
      if (userId) {
        requests.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return bTime.getTime() - aTime.getTime();
        });
      }
      
      return requests;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  },

  // Get available requests for technicians
  getAvailableRequests: async (): Promise<ServiceRequest[]> => {
    try {
      const q = query(
        collection(db, 'serviceRequests'),
        where('status', '==', 'pending')
      );

      const querySnapshot = await getDocs(q);
      const requests: ServiceRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({
          ...doc.data(),
          _id: doc.id
        } as ServiceRequest);
      });
      
      // Sort manually by createdAt if needed
      requests.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      
      return requests;
    } catch (error) {
      console.error('Error fetching available requests:', error);
      throw error;
    }
  },

  // Accept a request
  acceptRequest: async (requestId: string, technicianId: string): Promise<ServiceRequest> => {
    try {
      const requestRef = doc(db, 'serviceRequests', requestId);
      await updateDoc(requestRef, {
        status: 'accepted',
        technicianId: technicianId,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const updatedDoc = await getDoc(requestRef);
      return {
        ...updatedDoc.data(),
        _id: updatedDoc.id
      } as ServiceRequest;
    } catch (error) {
      console.error('Error accepting request:', error);
      throw error;
    }
  },

  // Get a request by ID
  getRequestById: async (id: string): Promise<ServiceRequest | null> => {
    try {
      const requestDoc = await getDoc(doc(db, 'serviceRequests', id));
      
      if (requestDoc.exists()) {
        return {
          ...requestDoc.data(),
          _id: requestDoc.id
        } as ServiceRequest;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching request by ID:', error);
      throw error;
    }
  },

  // Cancel a request
  cancelRequest: async (requestId: string): Promise<ServiceRequest> => {
    try {
      const requestRef = doc(db, 'serviceRequests', requestId);
      await updateDoc(requestRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const updatedDoc = await getDoc(requestRef);
      return {
        ...updatedDoc.data(),
        _id: updatedDoc.id
      } as ServiceRequest;
    } catch (error) {
      console.error('Error canceling request:', error);
      throw error;
    }
  },

  // Complete a request
  completeRequest: async (requestId: string): Promise<ServiceRequest> => {
    try {
      const requestRef = doc(db, 'serviceRequests', requestId);
      await updateDoc(requestRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const updatedDoc = await getDoc(requestRef);
      return {
        ...updatedDoc.data(),
        _id: updatedDoc.id
      } as ServiceRequest;
    } catch (error) {
      console.error('Error completing request:', error);
      throw error;
    }
  },
};