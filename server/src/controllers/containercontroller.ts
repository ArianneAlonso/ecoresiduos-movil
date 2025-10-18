import { Request, Response } from 'express';
import Container from '../models/container';
import { AuthRequest } from '../middlewares/authmiddleware';

// OBTENER TODOS LOS CONTENEDORES (RUTA PÚBLICA)
export const getContainers = async (req: Request, res: Response) => {
  try {
    const containers = await Container.find({});
    res.json(containers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los contenedores' });
  }
};

// CREAR UN NUEVO CONTENEDOR (SOLO ADMIN)
export const createContainer = async (req: AuthRequest, res: Response) => {
  // Verificación de tipo para TypeScript
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const { title, coordinates, acceptedMaterials } = req.body;
  
  // Verificación de datos de entrada
  if (!title || !coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(400).json({ message: 'Faltan datos obligatorios o el formato de las coordenadas es incorrecto.' });
  }

  try {
    const container = new Container({
      title,
      location: {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]] // [longitud, latitud]
      },
      acceptedMaterials,
      createdBy: req.user._id // Obtenido del token a través del middleware 'protect'
    });

    const createdContainer = await container.save();
    res.status(201).json(createdContainer);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el contenedor', error });
  }
};

// ACTUALIZAR UN CONTENEDOR (SOLO ADMIN)
export const updateContainer = async (req: Request, res: Response) => {
  try {
    const container = await Container.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!container) {
      return res.status(404).json({ message: 'Contenedor no encontrado' });
    }
    res.json(container);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al actualizar' });
  }
};

// BORRAR UN CONTENEDOR (SOLO ADMIN)
export const deleteContainer = async (req: Request, res: Response) => {
  try {
    const container = await Container.findByIdAndDelete(req.params.id);
    if (!container) {
      return res.status(404).json({ message: 'Contenedor no encontrado' });
    }
    res.json({ message: 'Contenedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al eliminar' });
  }
};