import express from 'express';
const router = express.Router();
import * as reviewController from '../controllers/review.controller.js';
import { verificarToken as auth } from '../middlewares/auth.js';

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private (Client only)
router.post('/', auth, reviewController.createReview);

// @route   GET /api/reviews/:technicianId
// @desc    Get all reviews for a specific technician
// @access  Public
router.get('/:technicianId', reviewController.getReviewsForTechnician);

export default router;
