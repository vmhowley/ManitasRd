import express from 'express';
const router = express.Router();
import { uploadImages } from '../controllers/upload.controller.js';
import { verificarToken as auth } from '../middlewares/auth.js';

router.post('/', auth, uploadImages);

export default router;
