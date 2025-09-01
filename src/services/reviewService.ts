import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

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
  createReview: async (reviewData: ReviewData): Promise<Review> => {
    try {
      const reviewDoc = {
        ...reviewData,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewDoc);
      const newDoc = await getDoc(docRef);
      
      return {
        ...newDoc.data(),
        _id: newDoc.id
      } as Review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  getReviewsForTechnician: async (technicianId: string): Promise<Review[]> => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('technician', '==', technicianId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        reviews.push({
          ...doc.data(),
          _id: doc.id
        } as Review);
      });
      
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews for technician:', error);
      throw error;
    }
  },
};
