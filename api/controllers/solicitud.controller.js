// controllers/solicitud.controller.js
import Solicitud from '../models/Solicitud.js'

export const crearSolicitud = async (req, res) => {
  const { descripcion, categoria, direccion, fechaSolicitada } = req.body
  const nueva = new Solicitud({
    clienteId: req.usuario.id,
    descripcion,
    categoria,
    direccion,
    fechaSolicitada
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
      $or: [{ clienteId: req.usuario.id }, { tecnicoId: req.usuario.id }]
    })
    res.json(solicitudes)
  } catch (err) {
    res.status(500).json({ msg: 'Error consultando solicitudes', error: err.message })
  }
}
