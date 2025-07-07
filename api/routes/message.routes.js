import express from 'express';
const router = express.Router();
import * as messageController from '../controllers/message.controller.js';
import { verificarToken as auth } from '../middlewares/auth.js';

router.post('/', auth, messageController.sendMessage);
router.get('/:otherUserId', auth, messageController.getMessages);

export default router;