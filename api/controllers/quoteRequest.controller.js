import QuoteRequest from '../models/QuoteRequest.js';
import mongoose from 'mongoose';

// @desc    Create a new quote request
// @route   POST /api/quoterequests
// @access  Private (Client)
export const createQuoteRequest = async (req, res) => {
  try {
    const { description, category, location, images } = req.body;
    const clientId = req.user.id; // Set by auth middleware

    const newQuoteRequest = new QuoteRequest({
      clientId,
      description,
      category,
      location,
      images: images || [], // Handle optional images
    });

    await newQuoteRequest.save();
    res.status(201).json(newQuoteRequest);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all quote requests based on user type
// @route   GET /api/quoterequests
// @access  Private
export const getQuoteRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    let query = {};
    if (userType === 'client') {
      // Client sees their own requests
      query = { clientId: userId };
    } else if (userType === 'technician') {
      // Technician sees pending or quoted requests they haven't proposed on,
      // and requests they have proposed on (unless completed/cancelled)
      query = {
        $or: [
          {
            status: { $in: ['pending', 'quoted'] },
            'proposals.technicianId': { $ne: userId } // Technician has not submitted a proposal
          },
          {
            'proposals.technicianId': userId,
            status: { $nin: ['completed', 'cancelled'] } // Don't show completed/cancelled requests they proposed on
          }
        ]
      };
    }

    const quoteRequests = await QuoteRequest.find(query)
      .populate('clientId', 'name email')
      .populate('proposals.technicianId', 'name email specialty')
      .sort({ createdAt: -1 });

    res.status(200).json(quoteRequests);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get a single quote request by ID
// @route   GET /api/quoterequests/:id
// @access  Private
export const getQuoteRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const quoteRequest = await QuoteRequest.findById(id)
      .populate('clientId', 'name email')
      .populate('selectedTechnicianId', 'name email')
      .populate({
        path: 'proposals',
        populate: {
          path: 'technicianId',
          select: 'name email specialty averageRating', // Populate technician details within proposals
        }
      });

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Solicitud de presupuesto no encontrada' });
    }

    // Optional: Add authorization check if needed (e.g., only client or involved technicians can view)

    res.status(200).json(quoteRequest);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Add a proposal to a quote request
// @route   POST /api/quoterequests/:id/proposals
// @access  Private (Technician)
export const addProposalToQuoteRequest = async (req, res) => {
  try {
    const { id: quoteRequestId } = req.params;
    const technicianId = req.user.id;
    const { laborCost, materialsCost, estimatedTime, comments } = req.body;

    if (req.user.type !== 'technician') {
      return res.status(403).json({ message: 'Solo los técnicos pueden enviar propuestas.' });
    }

    const quoteRequest = await QuoteRequest.findById(quoteRequestId);

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Solicitud de presupuesto no encontrada' });
    }

    if (quoteRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Esta solicitud ya no acepta propuestas.' });
    }
    
    // Check if technician has already submitted a proposal
    const existingProposal = quoteRequest.proposals.find(p => p.technicianId.toString() === technicianId);
    if (existingProposal) {
        return res.status(400).json({ message: 'Ya has enviado una propuesta para esta solicitud.' });
    }

    const newProposal = {
      technicianId,
      laborCost,
      materialsCost,
      totalPrice: Number(laborCost) + Number(materialsCost || 0),
      estimatedTime,
      comments,
    };

    quoteRequest.proposals.push(newProposal);
    quoteRequest.status = 'quoted'; // Update status now that it has at least one quote

    await quoteRequest.save();
    res.status(201).json(quoteRequest);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Accept a proposal
// @route   PATCH /api/quoterequests/:id/proposals/:proposalId/accept
// @access  Private (Client)
export const acceptProposal = async (req, res) => {
  try {
    const { id: quoteRequestId, proposalId } = req.params;
    const clientId = req.user.id;

    if (req.user.type !== 'client') {
      return res.status(403).json({ message: 'Solo los clientes pueden aceptar propuestas.' });
    }

    const quoteRequest = await QuoteRequest.findById(quoteRequestId);

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Solicitud de presupuesto no encontrada.' });
    }

    if (quoteRequest.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'No estás autorizado para modificar esta solicitud.' });
    }

    if (quoteRequest.status !== 'quoted') {
      return res.status(400).json({ message: 'La solicitud no está en estado para aceptar propuestas.' });
    }

    const proposalToAccept = quoteRequest.proposals.find(p => p._id.toString() === proposalId);

    if (!proposalToAccept) {
      return res.status(404).json({ message: 'Propuesta no encontrada.' });
    }

    quoteRequest.status = 'in_progress';
    quoteRequest.selectedTechnicianId = proposalToAccept.technicianId;
    quoteRequest.acceptedProposalId = proposalToAccept._id;

    await quoteRequest.save();
    res.status(200).json(quoteRequest);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update the status of a quote request (e.g., to complete or cancel)
// @route   PATCH /api/quoterequests/:id/status
// @access  Private
export const updateQuoteRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // expecting { "status": "completed" } or { "status": "cancelled" }
        const userId = req.user.id;
        const userType = req.user.type;

        const quoteRequest = await QuoteRequest.findById(id);

        if (!quoteRequest) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        // Authorization: Only the client or the selected technician can modify the status post-acceptance
        if (userType === 'client' && quoteRequest.clientId.toString() !== userId) {
            return res.status(403).json({ message: 'No autorizado.' });
        }
        if (userType === 'technician' && quoteRequest.selectedTechnicianId?.toString() !== userId) {
            return res.status(403).json({ message: 'No autorizado.' });
        }

        // Logic for status transitions
        if (status === 'completed' && quoteRequest.status === 'in_progress') {
            quoteRequest.status = 'completed';
        } else if (status === 'cancelled') {
            // Allow cancellation if it's pending, quoted, or in_progress
            if (['pending', 'quoted', 'in_progress'].includes(quoteRequest.status)) {
                quoteRequest.status = 'cancelled';
            } else {
                return res.status(400).json({ message: `No se puede cancelar una solicitud en estado '${quoteRequest.status}'.` });
            }
        } else {
            return res.status(400).json({ message: `Transición de estado no válida a '${status}'.` });
        }

        await quoteRequest.save();
        res.status(200).json(quoteRequest);

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};
