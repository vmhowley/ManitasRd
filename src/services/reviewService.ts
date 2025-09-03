import { 
  collection, 
  addDoc, 
  getDocs,
  query, 
  where,
  serverTimestamp,
  orderBy as firestoreOrderBy
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
  createReview: async (reviewData: any) => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const docRef = await addDoc(reviewsRef, {
        ...reviewData,
        createdAt: serverTimestamp()
      });
      
      // Usar getDocs en lugar de getDoc
      const snapshot = await getDocs(query(reviewsRef, where('__name__', '==', docRef.id)));
      if (!snapshot.empty) {
        const newDoc = snapshot.docs[0];
        return {
          id: newDoc.id,
          ...newDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  getReviewsByTechnicianId: async (technicianId: string) => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('technicianId', '==', technicianId),
        firestoreOrderBy('createdAt', 'desc')
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
