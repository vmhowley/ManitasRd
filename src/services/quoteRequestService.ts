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
  serverTimestamp,
  arrayUnion 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { User } from '../types/User';

// --- TYPE DEFINITIONS ---

// Represents a single proposal from a technician
export interface Proposal {
  _id: string;
  technicianId: User;
  laborCost: number;
  materialsCost: number;
  totalPrice: number;
  estimatedTime: string;
  comments?: string;
  createdAt: string;
}

// Represents the main quote request object
export interface QuoteRequest {
  _id: string;
  clientId: User;
  description: string;
  category: string;
  location: string;
  images?: string[];
  status: 'pending' | 'quoted' | 'in_progress' | 'completed' | 'cancelled';
  proposals: Proposal[];
  selectedTechnicianId?: User;
  acceptedProposalId?: string;
  createdAt: string;
}

// Data required to create a new quote request
export interface QuoteRequestData {
  clientId: string;
  description: string;
  category: string;
  location: string;
  images?: string[];
}

// Data required for a technician to submit a proposal
export interface ProposalData {
  laborCost: number;
  materialsCost?: number;
  estimatedTime: string;
  comments?: string;
}

// --- SERVICE METHODS ---

export const quoteRequestService = {
  /**
   * Creates a new quote request.
   * @param data - The data for the new quote request.
   */
  createQuoteRequest: async (data: QuoteRequestData): Promise<QuoteRequest> => {
    try {
      const quoteRequestDoc = {
        ...data,
        status: 'pending' as const,
        proposals: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'quoteRequests'), quoteRequestDoc);
      const newDoc = await getDoc(docRef);
      
      return {
        ...newDoc.data(),
        _id: newDoc.id
      } as QuoteRequest;
    } catch (error) {
      console.error('Error creating quote request:', error);
      throw error;
    }
  },

  /**
   * Fetches all quote requests relevant to the current user (client or technician).
   */
  getQuoteRequests: async (userId?: string): Promise<QuoteRequest[]> => {
    try {
      let q;
      if (userId) {
        // Temporarily remove orderBy to avoid index requirement
        q = query(
          collection(db, 'quoteRequests'),
          where('clientId', '==', userId)
        );
      } else {
        q = query(
          collection(db, 'quoteRequests'),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const quoteRequests: QuoteRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        quoteRequests.push({
          ...doc.data(),
          _id: doc.id
        } as QuoteRequest);
      });
      
      // Sort manually by createdAt if userId is provided
      if (userId) {
        quoteRequests.sort((a, b) => {
          const aTime = new Date(a.createdAt);
          const bTime = new Date(b.createdAt);
          return bTime.getTime() - aTime.getTime();
        });
      }
      
      return quoteRequests;
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      throw error;
    }
  },

  /**
   * Fetches a single quote request by its ID.
   * @param id - The ID of the quote request.
   */
  getQuoteRequestById: async (id: string): Promise<QuoteRequest | null> => {
    try {
      const docRef = doc(db, 'quoteRequests', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          _id: docSnap.id
        } as QuoteRequest;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching quote request by ID:', error);
      throw error;
    }
  },

  /**
   * Adds a proposal to a specific quote request.
   * @param quoteRequestId - The ID of the quote request.
   * @param proposalData - The data for the new proposal.
   */
  addProposal: async (quoteRequestId: string, proposalData: ProposalData): Promise<QuoteRequest> => {
    try {
      const proposal = {
        ...proposalData,
        _id: doc(collection(db, 'temp')).id, // Generate unique ID
        totalPrice: (proposalData.laborCost || 0) + (proposalData.materialsCost || 0),
        createdAt: new Date().toISOString()
      };

      const docRef = doc(db, 'quoteRequests', quoteRequestId);
      await updateDoc(docRef, {
        proposals: arrayUnion(proposal)
      });
      
      const updatedDoc = await getDoc(docRef);
      return {
        ...updatedDoc.data(),
        _id: updatedDoc.id
      } as QuoteRequest;
    } catch (error) {
      console.error('Error adding proposal:', error);
      throw error;
    }
  },

  /**
   * Accepts a specific proposal for a quote request.
   * @param quoteRequestId - The ID of the quote request.
   * @param proposalId - The ID of the proposal to accept.
   */
  acceptProposal: async (quoteRequestId: string, proposalId: string): Promise<QuoteRequest> => {
    try {
      const docRef = doc(db, 'quoteRequests', quoteRequestId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Quote request not found');
      }
      
      const quoteRequest = docSnap.data() as QuoteRequest;
      const selectedProposal = quoteRequest.proposals.find(p => p._id === proposalId);
      
      if (!selectedProposal) {
        throw new Error('Proposal not found');
      }
      
      await updateDoc(docRef, {
        status: 'quoted',
        acceptedProposalId: proposalId,
        selectedTechnicianId: selectedProposal.technicianId
      });
      
      const updatedDoc = await getDoc(docRef);
      return {
        ...updatedDoc.data(),
        _id: updatedDoc.id
      } as QuoteRequest;
    } catch (error) {
      console.error('Error accepting proposal:', error);
      throw error;
    }
  },

  /**
   * Updates the status of a quote request (e.g., to 'completed' or 'cancelled').
   * @param quoteRequestId - The ID of the quote request.
   * @param status - The new status.
   */
  updateStatus: async (quoteRequestId: string, status: 'completed' | 'cancelled'): Promise<QuoteRequest> => {
    try {
      const docRef = doc(db, 'quoteRequests', quoteRequestId);
      await updateDoc(docRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(docRef);
      return {
        ...updatedDoc.data(),
        _id: updatedDoc.id
      } as QuoteRequest;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },
};