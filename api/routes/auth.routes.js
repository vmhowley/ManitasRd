// routes/auth.routes.js
import express from 'express'
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller.js'
import multer from 'multer'
import { verificarToken } from '../middlewares/auth.js'
import { validateRegistration } from '../middlewares/validation.js';

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post('/register', upload.single('avatar'), validateRegistration, register)
router.post('/login', login)
router.get('/me', verificarToken, getMe)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)

export default router
