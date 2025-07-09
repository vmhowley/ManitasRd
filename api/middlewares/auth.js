// middlewares/auth.js
import jwt from 'jsonwebtoken'
import User from '../models/Users.js'

export const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token malformado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Error in verificarToken:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expirado', expiredAt: err.expiredAt });
    } else {
      return res.status(401).json({ msg: 'Token inválido' });
    }
  }
};
