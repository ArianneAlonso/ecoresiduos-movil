import { Response } from 'express';
import QRCode from '../models/qrcode';
import User from '../models/user';
import { AuthRequest } from '../middlewares/authmiddleware';
import { randomUUID } from 'crypto'; // Para generar códigos únicos

// --- Conductor ---
export const generateQRCode = async (req: AuthRequest, res: Response) => {
  // Verificación de usuario autenticado
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const code = randomUUID(); // Genera un ID único universal
    const qr = await QRCode.create({
      code,
      generatedBy: req.user._id,
      points: 50, // O un valor que venga en el body
    });
    res.status(201).json({ qrCode: qr.code });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el QR' });
  }
};

// --- Usuario ---
export const scanQRCode = async (req: AuthRequest, res: Response) => {
  // Verificación de usuario autenticado
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  const { code } = req.body;
  try {
    const qr = await QRCode.findOne({ code });
    if (!qr) {
      return res.status(404).json({ message: 'Código QR no válido' });
    }
    if (qr.isScanned) {
      return res.status(400).json({ message: 'Este código ya fue escaneado' });
    }

    // Actualizar el documento del QR
    qr.isScanned = true;
    qr.scannedAt = new Date();
    qr.scannedBy = req.user._id;
    await qr.save();

    // Actualizar los puntos del usuario
    const user = await User.findById(req.user._id);
    if (user) {
      user.points += qr.points;
      await user.save();
      res.json({ 
        message: `¡Felicitaciones! Has ganado ${qr.points} puntos.`, 
        newTotalPoints: user.points 
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al escanear el QR' });
  }
};