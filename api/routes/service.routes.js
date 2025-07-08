import express from 'express';
const router = express.Router();
import * as serviceController from '../controllers/service.controller.js';
import { verificarToken as auth } from '../middlewares/auth.js';

// @route   GET /api/services
// @desc    Get all active services for clients to see
router.get('/', serviceController.getActiveServices);

// @route   GET /api/services/:id
// @desc    Get a single service by its ID
router.get('/:id', auth, serviceController.getServiceById);

// @route   POST /api/services
// @desc    Create a new service (protected for admin users)
router.post('/', auth, serviceController.createService);

export default router;
