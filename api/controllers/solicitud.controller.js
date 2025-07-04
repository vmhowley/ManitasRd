// controllers/solicitud.controller.js
import Solicitud from '../models/Solicitud.js'

export const crearSolicitud = async (req, res) => {
  console.log("🚀 ~ crearSolicitud ~ req:", req.user)
  const { description, category, address, requestDate, clientId } = req.body
  const nueva = new Solicitud({
    clientId: req.user.id,
    description,
    category,
    address,
    requestDate,
  });

  try {
    const saved = await nueva.save()
    res.json(saved)
  } catch (err) {
    res.status(500).json({ msg: 'Error creando solicitud', error: err.message })
  }
}

export const listarSolicitudesPorUsuario = async (req, res) => {
  console.log("🚀 ~ listarSolicitudesPorUsuario ~ req:", req.user.id)
  try {
    const solicitudes = await Solicitud.find({
      $or: [{ clientId: req.user.id }, { technicianId: req.user.id }]
    })
    res.json(solicitudes)
  } catch (err) {
    res.status(500).json({ msg: 'Error consultando solicitudes', error: err.message })
  }
}
