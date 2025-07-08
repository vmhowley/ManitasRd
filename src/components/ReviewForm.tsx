import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { reviewService } from '../services/reviewService';

interface ReviewFormProps {
  serviceRequestId: string;
  technicianId: string;
  onReviewSubmitted: () => void;
  onClose: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  serviceRequestId,
  technicianId,
  onReviewSubmitted,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (rating === 0) {
      setError('Por favor, selecciona una calificación.');
      setLoading(false);
      return;
    }

    try {
      await reviewService.createReview({
        serviceRequestId,
        technician: technicianId,
        rating,
        comment,
      });
      setSuccess('¡Reseña enviada con éxito!');
      onReviewSubmitted();
      setTimeout(() => onClose(), 2000); // Close after 2 seconds
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Hubo un error al enviar tu reseña. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Califica tu Servicio</h2>
        <p className="text-gray-600 mb-6">Ayúdanos a mejorar tu experiencia y la de otros usuarios.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tu Calificación</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  size={32}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comentario (Opcional)</label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="¿Qué te pareció el servicio?"
            ></textarea>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Reseña'}
          </button>
        </form>
      </div>
    </div>
  );
};
