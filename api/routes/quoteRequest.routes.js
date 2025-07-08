import express from 'express';
const router = express.Router();
import * as quoteRequestController from '../controllers/quoteRequest.controller.js';
import { verificarToken as auth } from '../middlewares/auth.js';

// @route   POST /api/quoterequests
// @desc    Create a new quote request
router.post('/', auth, quoteRequestController.createQuoteRequest);

// @route   GET /api/quoterequests
// @desc    Get all quote requests for the logged-in user
router.get('/', auth, quoteRequestController.getQuoteRequests);

// @route   GET /api/quoterequests/:id
// @desc    Get a single quote request by its ID
router.get('/:id', auth, quoteRequestController.getQuoteRequestById);

// @route   POST /api/quoterequests/:id/proposals
// @desc    Add a new proposal to a quote request
router.post('/:id/proposals', auth, quoteRequestController.addProposalToQuoteRequest);

// @route   PATCH /api/quoterequests/:id/proposals/:proposalId/accept
// @desc    Accept a specific proposal for a quote request
router.patch('/:id/proposals/:proposalId/accept', auth, quoteRequestController.acceptProposal);

// @route   PATCH /api/quoterequests/:id/status
// @desc    Update the status of a quote request (e.g., complete, cancel)
router.patch('/:id/status', auth, quoteRequestController.updateQuoteRequestStatus);

export default router;
