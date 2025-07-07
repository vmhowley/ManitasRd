import QuoteRequest from '../models/QuoteRequest.js';
import mongoose from 'mongoose';

export const createQuoteRequest = async (req, res) => {
  try {
    const { description, category, location } = req.body;
    const clientId = req.user.id; // Assuming req.user.id is set by auth middleware

    const newQuoteRequest = new QuoteRequest({
      clientId: new mongoose.Types.ObjectId(clientId),
      description,
      category,
      location,
    });

    await newQuoteRequest.save();
    res.status(201).json(newQuoteRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuoteRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    let query = {};
    if (userType === 'client') {
      query = { clientId: new mongoose.Types.ObjectId(userId) };
    } else if (userType === 'technician') {
      // Technicians can see pending requests or those they have quoted/accepted
      query = { $or: [{ status: 'pending' }, { technicianId: new mongoose.Types.ObjectId(userId) }] };
    }

    const quoteRequests = await QuoteRequest.find(query)
      .populate('clientId', 'name email')
      .populate('technicianId', 'name email');

    res.status(200).json(quoteRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuoteRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const quoteRequest = await QuoteRequest.findById(id)
      .populate('clientId', 'name email')
      .populate('technicianId', 'name email');

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Solicitud de presupuesto no encontrada' });
    }

    res.status(200).json(quoteRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewQuoteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const technicianId = req.user.id;

    const quoteRequest = await QuoteRequest.findById(id);

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Solicitud de presupuesto no encontrada' });
    }

    if (req.user.type !== 'technician') {
      return res.status(403).json({ message: 'Solo los técnicos pueden revisar solicitudes.' });
    }

    if (quoteRequest.status !== 'pending') {
      return res.status(400).json({ message: 'La solicitud ya no está pendiente.' });
    }

    quoteRequest.status = 'reviewed';
    quoteRequest.technicianId = new mongoose.Types.ObjectId(technicianId);
    await quoteRequest.save();

    res.status(200).json(quoteRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const quoteQuoteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotedPrice } = req.body;
    const technicianId = req.user.id;

    const quoteRequest = await QuoteRequest.findById(id);

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Solicitud de presupuesto no encontrada' });
    }

    if (req.user.type !== 'technician') {
      return res.status(403).json({ message: 'Solo los técnicos pueden cotizar solicitudes.' });
    }

    if (quoteRequest.status !== 'reviewed' || quoteRequest.technicianId?.toString() !== technicianId) {
      return res.status(400).json({ message: 'La solicitud no está en estado de revisión o no te ha sido asignada.' });
    }

    if (!quotedPrice || typeof quotedPrice !== 'number' || quotedPrice <= 0) {
      return res.status(400).json({ message: 'Precio cotizado inválido.' });
    }

    quoteRequest.status = 'quoted';
    quoteRequest.quotedPrice = quotedPrice;
    await quoteRequest.save();

    res.status(200).json(quoteRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuoteRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quotedPrice } = req.body;
    const technicianId = req.user.id; // Assuming technician is updating status

    const quoteRequest = await QuoteRequest.findById(id);

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Solicitud de presupuesto no encontrada' });
    }

    // Only technicians can set status to 'quoted' or 'accepted'
    if (req.user.type === 'technician') {
      if (status === 'quoted' && quotedPrice) {
        quoteRequest.status = status;
        quoteRequest.quotedPrice = quotedPrice;
        quoteRequest.technicianId = new mongoose.Types.ObjectId(technicianId);
      } else if (status === 'accepted' && quoteRequest.technicianId.toString() === technicianId) {
        quoteRequest.status = status;
      } else {
        return res.status(403).json({ message: 'Acción no permitida para este usuario o estado' });
      }
    } else if (req.user.type === 'client') {
      // Clients can only accept or reject a quote
      if (status === 'accepted' || status === 'rejected') {
        quoteRequest.status = status;
      } else {
        return res.status(403).json({ message: 'Acción no permitida para este usuario o estado' });
      }
    }

    await quoteRequest.save();
    res.status(200).json(quoteRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
