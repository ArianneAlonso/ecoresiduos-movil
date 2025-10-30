import { Request, Response } from 'express';
import { classifyImage } from '../services/geminiservice';
import fs from 'fs';

export const handleImageUpload = async (req: Request, res: Response) => {
  try {
    // 1. Verificar si el archivo fue subido por Multer
    if (!req.file) {
      // Este error se activa si el fileFilter de Multer rechaza el archivo
      return res.status(400).json({ detail: "Tipo de archivo inválido. Solo se permite PNG o JPEG." });
    }

    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;

    // 2. Llamar al servicio para procesar la imagen
    // El servicio se encargará de eliminar el archivo
    const responseText = await classifyImage(imagePath, mimeType);

    // 3. Devolver el resultado exitoso
    return res.status(200).json({ result: responseText });

  } catch (error) {
    // 4. Manejar errores
    console.error("Error procesando imagen:", error);
    
    // Limpiar el archivo si quedó huérfano por un error en el servicio
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    
    const message = error instanceof Error ? error.message : "Error interno al procesar la imagen.";
    
    if (message.includes("Tipo de archivo no soportado")) {
        return res.status(400).json({ detail: message });
    }
    
    return res.status(500).json({ detail: message });
  }
};
