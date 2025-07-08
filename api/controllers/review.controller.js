import Review from '../models/Review.js';
import User from '../models/Users.js';
import Solicitud from '../models/Solicitud.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Client only)
export const createReview = async (req, res) => {
  const { serviceRequest, technician, rating, comment } = req.body;
  const client = req.user.id; // Assuming req.user.id is set by auth middleware

  try {
    // Check if the service request exists and is completed
    const solicitud = await Solicitud.findById(serviceRequest);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud de servicio no encontrada.' });
    }
    if (solicitud.status !== 'completed') {
      return res.status(400).json({ message: 'Solo se pueden dejar reseñas para servicios completados.' });
    }
    if (solicitud.clientId.toString() !== client) {
      return res.status(403).json({ message: 'No estás autorizado para dejar una reseña en esta solicitud.' });
    }
    if (solicitud.technicianId.toString() !== technician) {
      return res.status(400).json({ message: 'El técnico especificado no corresponde a esta solicitud.' });
    }

    // Check if a review already exists for this service request
    const existingReview = await Review.findOne({ serviceRequest });
    if (existingReview) {
      return res.status(400).json({ message: 'Ya has dejado una reseña para esta solicitud de servicio.' });
    }

    const review = new Review({
      serviceRequest,
      client,
      technician,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: 'Reseña creada con éxito.', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la reseña.', error: error.message });
  }
};

// @desc    Get all reviews for a specific technician
// @route   GET /api/reviews/:technicianId
// @access  Public
export const getReviewsForTechnician = async (req, res) => {
  try {
    const reviews = await Review.find({ technician: req.params.technicianId })
      .populate('client', 'name avatar') // Populate client name and avatar
      .sort('-createdAt');

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reseñas.', error: error.message });
  }
};