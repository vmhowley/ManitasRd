import { api } from '../api/config';
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

const API_URL = '/quote-requests';

export const quoteRequestService = {
  /**
   * Creates a new quote request.
   * @param data - The data for the new quote request.
   */
  createQuoteRequest: async (data: QuoteRequestData) => {
    try {
      
      const response = await api.post<QuoteRequest>(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating quote request:', error);
      throw error;
    }
  },

  /**
   * Fetches all quote requests relevant to the current user (client or technician).
   */
  getQuoteRequests: async () => {
    try {
      
      const response = await api.get<QuoteRequest[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      throw error;
    }
  },

  /**
   * Fetches a single quote request by its ID.
   * @param id - The ID of the quote request.
   */
  getQuoteRequestById: async (id: string) => {
    try {
      
      const response = await api.get<QuoteRequest>(`${API_URL}/${id}`);
      return response.data;
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
  addProposal: async (quoteRequestId: string, proposalData: ProposalData) => {
    try {
      
      const response = await api.post<QuoteRequest>(`${API_URL}/${quoteRequestId}/proposals`, proposalData);
      return response.data;
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
  acceptProposal: async (quoteRequestId: string, proposalId: string) => {
    try {
      
      const response = await api.patch<QuoteRequest>(`${API_URL}/${quoteRequestId}/proposals/${proposalId}/accept`);
      return response.data;
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
  updateStatus: async (quoteRequestId: string, status: 'completed' | 'cancelled') => {
    try {
      
      const response = await api.patch<QuoteRequest>(`${API_URL}/${quoteRequestId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },
};