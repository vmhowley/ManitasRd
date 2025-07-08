import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.js';

router.get('/', userController.getUsers);
router.put('/:id', verificarToken, userController.updateUser);

export default router;
