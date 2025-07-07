// routes/auth.routes.js
import express from 'express'
import { register, login } from '../controllers/auth.controller.js'
import multer from 'multer'

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

router.post('/register', upload.single('avatar'), register)
router.post('/login', login)

export default router
