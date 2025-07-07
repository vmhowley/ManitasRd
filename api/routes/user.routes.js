import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';

router.get('/', userController.getUsers);

export default router;
