import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from "../models/Users.js";

// Helper function to setup nodemailer transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, type, phone, address, specialties, hourlyRate } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
    
    // Crear el nuevo usuario
    const user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      type,
      phone,
      address,
      regDate: new Date()
    });
    
    // Agregar campos específicos para técnicos
    if (type === 'technician') {
      user.specialties = specialties || [];
      user.hourlyRate = hourlyRate || 0;
      user.averageRating = 0;
      user.numReviews = 0;
    }
    
    // Manejar la imagen de avatar si se proporciona
    if (req.file) {
      user.avatar = req.file.path;
    }
    
    // Guardar el usuario en la base de datos
    await user.save();
    
    // Crear y firmar el token JWT
    const payload = {
      id: user.id,
      name: user.name,
      type: user.type,
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // El token expira en 1 hora
    });
    
    // Enviar respuesta exitosa con el token
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado.' });
    }

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas.' });
    }

    // 3. Crear y firmar el token JWT
    const payload = {
      id: user.id,
      name: user.name,
      type: user.type,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // El token expira en 1 hora
    });

    // 4. Enviar respuesta exitosa con el token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });

  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // El middleware verificarToken ya ha añadido el usuario a req.user
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Respond kindly, don't reveal if a user exists or not
      return res.status(200).json({ msg: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    
    const message = `
      <h1>Has solicitado un reseteo de contraseña</h1>
      <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste esto, por favor ignora este correo.</p>
    `;

    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"ManitasRD" <${process.env.SMTP_FROM_EMAIL}>`,
        to: user.email,
        subject: 'Reseteo de Contraseña - ManitasRD',
        html: message,
      });

      res.status(200).json({ msg: 'Correo de reseteo enviado.' });
    } catch (err) {
      console.error('Error sending email:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(500).json({ msg: 'Error al enviar el correo.' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'El token es inválido o ha expirado.' });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ msg: 'Contraseña actualizada con éxito.' });

  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
};
