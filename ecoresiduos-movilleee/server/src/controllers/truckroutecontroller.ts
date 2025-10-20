import { Request, Response } from 'express';
import TruckRoute from '../models/truckroute';
import { AuthRequest } from '../middlewares/authmiddleware';

// --- Admin ---
// CREAR UNA NUEVA RUTA DE RECOLECCIÓN
export const createRoute = async (req: Request, res: Response) => {
  const { zone, schedule, driver } = req.body;

  if (!zone || !schedule || !driver) {
      return res.status(400).json({ message: 'Faltan datos obligatorios: zona, horario y conductor.' });
  }

  try {
      const route = await TruckRoute.create({ zone, schedule, driver });
      res.status(201).json(route);
  } catch (error) {
      res.status(400).json({ message: 'Datos inválidos o error al crear la ruta' });
  }
};

// --- Conductor ---
// INICIAR EL RECORRIDO ASIGNADO
export const startRoute = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const route = await TruckRoute.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }
    
    if (route.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No estás autorizado para iniciar esta ruta' });
    }

    if (route.status !== 'pending') {
        return res.status(400).json({ message: 'Esta ruta no se puede iniciar porque no está pendiente.' });
    }

    route.status = 'in_progress';
    route.startedAt = new Date();
    await route.save();
    
    console.log(`¡Notificación enviada a los usuarios de la zona ${route.zone}!`);
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar la ruta' });
  }
};

// --- Usuario ---
// OBTENER LA RUTA ACTIVA EN LA ZONA DEL USUARIO
export const getActiveRouteForZone = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  try {
    const userZone = req.user.zone;
    const activeRoute = await TruckRoute.findOne({
      zone: userZone,
      status: 'in_progress'
    });
    
    if (!activeRoute) {
      return res.status(404).json({ message: 'No hay ningún recorrido activo en tu zona en este momento.' });
    }

    res.json(activeRoute);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al buscar la ruta activa' });
  }
};