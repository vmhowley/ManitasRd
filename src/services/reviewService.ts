import { api } from '../api/config';

export interface ReviewData {
  serviceRequestId: string;
  technician: string;
  rating: number;
  comment?: string;
}

export interface Review {
  _id: string;
  serviceRequest: string;
  client: {
    _id: string;
    name: string;
    avatar?: string;
  };
  technician: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export const reviewService = {
  createReview: (reviewData: ReviewData) => api.post<Review>('/reviews', reviewData),
  getReviewsForTechnician: (technicianId: string) => api.get<Review[]>(`/reviews/${technicianId}`),
};
