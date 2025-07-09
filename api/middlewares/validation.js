// middlewares/validation.js
import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('name').notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').isEmail().withMessage('Debe ser un correo electrónico válido.'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('type').isIn(['client', 'technician']).withMessage('El tipo de usuario debe ser "client" o "technician".'),
  body('phone').notEmpty().withMessage('El teléfono es obligatorio.'),
  body('address').notEmpty().withMessage('La dirección es obligatoria.'),

  // Conditional validation for technicians
  body('specialties').if(body('type').equals('technician')).notEmpty().withMessage('Las especialidades son obligatorias para los técnicos.'),
  body('hourlyRate').if(body('type').equals('technician')).isNumeric().withMessage('La tarifa por hora debe ser un número.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
