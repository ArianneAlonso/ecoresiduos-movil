import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authmiddleware';

// Función auxiliar para generar un token JWT
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en el archivo .env');
  }
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// REGISTRAR UN NUEVO USUARIO
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, zone } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Usar new User + save para activar middleware pre('save') (ej. hasheo de password)
    const user = new User({ username, email, password, zone });
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      zone: user.zone,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    console.error('Error en registerUser:', error);
    res.status(500).json({
      message: 'Error en el servidor al registrar el usuario',
      error: error.message || error.toString(),
    });
  }
};

// INICIAR SESIÓN
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        zone: user.zone,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Correo electrónico o contraseña inválidos' });
    }
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};

// OBTENER PERFIL DEL USUARIO LOGUEADO
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

// ACTUALIZAR PERFIL DEL USUARIO
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.settings && typeof req.body.settings.darkMode === 'boolean') {
      user.settings.darkMode = req.body.settings.darkMode;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

// BORRAR CUENTA DE USUARIO
export const deleteUserAccount = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const user = await User.findById(req.user._id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'Usuario eliminado correctamente' });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

// --- Funciones de Administrador ---

// CREAR UN NUEVO CONDUCTOR
export const createDriver = async (req: Request, res: Response) => {
  const { username, email, password, zone } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }
    const driver = new User({
      username,
      email,
      password,
      zone,
      role: 'driver',
    });
    await driver.save();

    res.status(201).json(driver);
  } catch (error: any) {
    console.error('Error en createDriver:', error);
    res.status(500).json({ message: 'Error en el servidor al crear el conductor', error: error.message || error.toString() });
  }
};
