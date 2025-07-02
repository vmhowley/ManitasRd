// middlewares/auth.js
import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) return res.status(401).json({ msg: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch {
    return res.status(401).json({ msg: 'Token inválido' })
  }
}
