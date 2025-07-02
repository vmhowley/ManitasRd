// routes/solicitud.routes.js
import express from 'express'
import { verificarToken } from '../middlewares/auth.js'
import { crearSolicitud, listarSolicitudesPorUsuario } from '../controllers/solicitud.controller.js'
const router = express.Router()

router.post('/', verificarToken, crearSolicitud)
router.get('/', verificarToken, listarSolicitudesPorUsuario)

export default router
