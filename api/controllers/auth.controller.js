// controllers/auth.controller.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/Users.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, type, phone, address, hourlyRate } = req.body;
    let specialties = [];
    if (type === 'technician' && req.body.specialties) {
      specialties = JSON.parse(req.body.specialties);
    }
    const avatar = req.file ? req.file.path : undefined;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ msg: 'Ya existe ese usuario' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashed,
      type,
      phone,
      address,
      ...(type === 'technician' && { specialties, experience: req.body.experience, hourlyRate }),
      ...(avatar && { avatar }),
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, type: newUser.type }, process.env.JWT_SECRET);
    res.json({ token, user: { ...newUser._doc, _id: newUser._id.toString() } });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' })

    const valido = await bcrypt.compare(password, user.password)
    if (!valido) return res.status(400).json({ msg: 'Credenciales inválidas' })

    const token = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET)
    res.json({ token, user: { ...user._doc, _id: user._id.toString(), specialties: user.specialties || [] } })
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message })
  }
}
