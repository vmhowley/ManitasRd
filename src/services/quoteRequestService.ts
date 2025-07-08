import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import type { User } from '../types/User';

// Base Axios instance
const API = axios.create({ baseURL: API_BASE_URL });

// Interceptor to add the auth token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

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

export const quoteRequestService = {
  /**
   * Creates a new quote request.
   * @param data - The data for the new quote request.
   */
  createQuoteRequest: (data: QuoteRequestData) => 
    API.post<QuoteRequest>('/api/quote-requests', data),

  /**
   * Fetches all quote requests relevant to the current user (client or technician).
   */
  getQuoteRequests: () => 
    API.get<QuoteRequest[]>('/api/quote-requests'),

  /**
   * Fetches a single quote request by its ID.
   * @param id - The ID of the quote request.
   */
  getQuoteRequestById: (id: string) => 
    API.get<QuoteRequest>(`/api/quote-requests/${id}`),

  /**
   * Adds a proposal to a specific quote request.
   * @param quoteRequestId - The ID of the quote request.
   * @param proposalData - The data for the new proposal.
   */
  addProposal: (quoteRequestId: string, proposalData: ProposalData) =>
    API.post<QuoteRequest>(`/api/quote-requests/${quoteRequestId}/proposals`, proposalData),

  /**
   * Accepts a specific proposal for a quote request.
   * @param quoteRequestId - The ID of the quote request.
   * @param proposalId - The ID of the proposal to accept.
   */
  acceptProposal: (quoteRequestId: string, proposalId: string) =>
    API.patch<QuoteRequest>(`/api/quote-requests/${quoteRequestId}/proposals/${proposalId}/accept`),

  /**
   * Updates the status of a quote request (e.g., to 'completed' or 'cancelled').
   * @param quoteRequestId - The ID of the quote request.
   * @param status - The new status.
   */
  updateStatus: (quoteRequestId: string, status: 'completed' | 'cancelled') =>
    API.patch<QuoteRequest>(`/api/quote-requests/${quoteRequestId}/status`, { status }),
};

