import express from 'express';
import {
  getUserById,
  getTechnicians,
  updateUserProfile,
  getChatContacts,
} from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Public routes
router.get('/technicians', getTechnicians);

// Protected routes
router.get('/chat-contacts', verificarToken, getChatContacts);
router.put('/profile', verificarToken, upload.single('avatar'), updateUserProfile);
router.get('/:id', getUserById);

export default router;