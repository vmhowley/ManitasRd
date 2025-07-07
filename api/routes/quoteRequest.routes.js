import express from 'express';
const router = express.Router();
import * as quoteRequestController from '../controllers/quoteRequest.controller.js';
import { verificarToken as auth } from '../middlewares/auth.js';

router.post('/', auth, quoteRequestController.createQuoteRequest);
router.get('/', auth, quoteRequestController.getQuoteRequests);
router.get('/:id', auth, quoteRequestController.getQuoteRequestById);
router.put('/:id/status', auth, quoteRequestController.updateQuoteRequestStatus);
router.put('/:id/review', auth, quoteRequestController.reviewQuoteRequest);
router.put('/:id/quote', auth, quoteRequestController.quoteQuoteRequest);

export default router;
