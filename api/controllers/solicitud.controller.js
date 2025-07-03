// controllers/solicitud.controller.js
import Solicitud from '../models/Solicitud.js'

export const crearSolicitud = async (req, res) => {
  const { description, category, address, requestDate } = req.body
  const nueva = new Solicitud({
    clientId: req.user.clientId,
    description,
    category,
    address,
    requestDate
  })

  try {
    const saved = await nueva.save()
    res.json(saved)
  } catch (err) {
    res.status(500).json({ msg: 'Error creando solicitud', error: err.message })
  }
}

export const listarSolicitudesPorUsuario = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({
      $or: [{ clientId: req.user.clientId }, { technicianId: req.user.technicianId }]
    })
    res.json(solicitudes)
  } catch (err) {
    res.status(500).json({ msg: 'Error consultando solicitudes', error: err.message })
  }
}
