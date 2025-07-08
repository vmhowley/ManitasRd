// controllers/solicitud.controller.js
import Solicitud from '../models/Solicitud.js'
import mongoose from 'mongoose'

export const crearSolicitud = async (req, res) => {
  const { description, category, address, requestDate, urgency, clientBudget, finalPrice, serviceId } = req.body
  const nueva = new Solicitud({
    clientId: new mongoose.Types.ObjectId(req.user.id),
    description,
    category,
    address,
    requestDate: new Date(requestDate),
    urgency,
    clientBudget,
    finalPrice, // Include new field
    serviceId, // Include new field
  });

  try {
    const saved = await nueva.save()
    res.json(saved)
  } catch (err) {
    res.status(500).json({ msg: 'Error creando solicitud', error: err.message })
  }
}

export const listarSolicitudesPorUsuario = async (req, res) => {
  try {
    let query = {};
    if (req.user.type === 'client') {
      query = { clientId: new mongoose.Types.ObjectId(req.user.id) };
    } else if (req.user.type === 'technician') {
      query = { technicianId: new mongoose.Types.ObjectId(req.user.id) };
    }
    const solicitudes = await Solicitud.find(query).lean();
    const formattedSolicitudes = solicitudes.map(solicitud => ({
      ...solicitud,
      _id: solicitud._id.toString(),
      clientId: solicitud.clientId ? solicitud.clientId.toString() : undefined,
      technicianId: solicitud.technicianId ? solicitud.technicianId.toString() : undefined,
    }));
    res.json(formattedSolicitudes);
  } catch (err) {
    res.status(500).json({ msg: 'Error consultando solicitudes', error: err.message });
  }
};

export const listarSolicitudesDisponibles = async (req, res) => {
  try {
    const technicianSpecialties = req.user.specialties || [];
    const query = {
      status: 'pending',
      technicianId: { $exists: false }, // Ensure no technician is assigned
      category: { $in: technicianSpecialties } // Filter by technician's specialties
    };
    const solicitudes = await Solicitud.find(query).lean();
    const formattedSolicitudes = solicitudes.map(solicitud => ({
      ...solicitud,
      _id: solicitud._id.toString(),
      clientId: solicitud.clientId ? solicitud.clientId.toString() : undefined,
    }));
    res.json(formattedSolicitudes);
  } catch (err) {
    res.status(500).json({ msg: 'Error consultando solicitudes disponibles', error: err.message });
  }
};

export const aceptarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const technicianId = req.user.id; // ID del técnico que acepta la solicitud

    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    if (solicitud.status !== 'pending') {
      return res.status(400).json({ msg: 'La solicitud ya no está pendiente' });
    }

    solicitud.technicianId = new mongoose.Types.ObjectId(technicianId);
    solicitud.status = 'assigned';
    await solicitud.save();

    res.json({ msg: 'Solicitud aceptada con éxito', solicitud });
  } catch (err) {
    res.status(500).json({ msg: 'Error al aceptar la solicitud', error: err.message });
  }
};

export const getSolicitudById = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findById(id)
      .populate('clientId', 'name avatar') // Populate client name and avatar
      .populate('technicianId', 'name avatar') // Populate technician name and avatar
      .populate('serviceId', 'name description basePrice priceModifiers') // Populate service details
      .lean();

    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    // Format the solicitud to ensure _id, clientId, technicianId are strings
    const formattedSolicitud = {
      ...solicitud,
      _id: solicitud._id.toString(),
      clientId: solicitud.clientId ? solicitud.clientId.toString() : undefined,
      technicianId: solicitud.technicianId ? solicitud.technicianId.toString() : undefined,
      serviceId: solicitud.serviceId ? solicitud.serviceId.toString() : undefined,
    };

    res.json(formattedSolicitud);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener la solicitud', error: err.message });
  }
};

export const cancelarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ID del usuario que intenta cancelar

    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    // Solo el cliente que creó la solicitud puede cancelarla
    if (solicitud.clientId.toString() !== userId) {
      return res.status(403).json({ msg: 'No tienes permiso para cancelar esta solicitud' });
    }

    // Solo se pueden cancelar solicitudes pendientes o asignadas
    if (!['pending', 'assigned'].includes(solicitud.status)) {
      return res.status(400).json({ msg: 'Solo se pueden cancelar solicitudes pendientes o asignadas' });
    }

    solicitud.status = 'cancelled';
    await solicitud.save();

    res.json({ msg: 'Solicitud cancelada con éxito', solicitud });
  } catch (err) {
    res.status(500).json({ msg: 'Error al cancelar la solicitud', error: err.message });
  }
};

export const completarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const technicianId = req.user.id; // ID del técnico que intenta completar

    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    // Solo el técnico asignado puede completar la solicitud
    if (solicitud.technicianId?.toString() !== technicianId) {
      return res.status(403).json({ msg: 'No tienes permiso para completar esta solicitud' });
    }

    // Solo se pueden completar solicitudes en proceso o asignadas
    if (!['assigned', 'in-process'].includes(solicitud.status)) {
      return res.status(400).json({ msg: 'Solo se pueden completar solicitudes asignadas o en proceso' });
    }

    solicitud.status = 'completed';
    await solicitud.save();

    res.json({ msg: 'Solicitud completada con éxito', solicitud });
  } catch (err) {
    res.status(500).json({ msg: 'Error al completar la solicitud', error: err.message });
  }
};