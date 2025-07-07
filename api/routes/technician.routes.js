import express from 'express';
import { getTechnicians } from '../controllers/technician.controller.js';

const router = express.Router();

router.get('/', getTechnicians);

export default router;