import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { Request } from 'express';

// Extendemos la interface de Request para incluir la propiedad 'user'
export interface AuthRequest extends Request {
  user?: IUser;
}

// Middleware para proteger rutas y verificar el token
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtenemos el token del header (ej: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verificamos el token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET no está definido');
      }
      const decoded = jwt.verify(token, secret) as { id: string };

      // Buscamos el usuario por el ID del token y lo añadimos a la petición
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
          return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      next(); // Pasamos al siguiente middleware o controlador
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, el token falló' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se encontró un token' });
  }
};

// Middleware para verificar si el usuario es Administrador
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

// Middleware para verificar si el usuario es Conductor
export const isDriver = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'driver') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de conductor.' });
  }
};