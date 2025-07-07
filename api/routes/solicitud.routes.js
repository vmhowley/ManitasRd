// routes/solicitud.routes.js
import express from 'express'
import { verificarToken } from '../middlewares/auth.js'
import { crearSolicitud, listarSolicitudesPorUsuario, listarSolicitudesDisponibles, aceptarSolicitud, getSolicitudById, cancelarSolicitud, completarSolicitud } from '../controllers/solicitud.controller.js'
const router = express.Router()

router.post('/', verificarToken, crearSolicitud)
router.get('/', verificarToken, listarSolicitudesPorUsuario)
router.get('/disponibles', verificarToken, listarSolicitudesDisponibles)
router.post('/:id/aceptar', verificarToken, aceptarSolicitud)
router.put('/:id/cancelar', verificarToken, cancelarSolicitud)
router.put('/:id/completar', verificarToken, completarSolicitud)
router.get('/:id', verificarToken, getSolicitudById)

export default router
