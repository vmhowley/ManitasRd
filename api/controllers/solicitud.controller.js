// controllers/solicitud.controller.js
import Solicitud from '../models/Solicitud.js'

export const crearSolicitud = async (req, res) => {
  const { description, category, address, requestDate } = req.body
  const nueva = new Solicitud({
    clientId: req.user._id,
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
    const requests = await Solicitud.find({
      $or: [{ clientId: req.user._id }, { technicianId: req.user._id }]
    })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ msg: 'Error consultando solicitudes', error: err.message })
  }
}
