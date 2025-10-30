import { model, systemPrompt } from '../config/geminiconfig';
import * as fs from 'fs';

/**
 * Convierte un archivo de imagen local a un formato que la API de Gemini entiende.
 * @param path Ruta al archivo de imagen
 * @param mimeType Tipo MIME de la imagen (ej. "image/png")
 * @returns Objeto de parte de datos generativa
 */
function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

/**
 * Procesa una imagen usando Gemini y devuelve la clasificación.
 * (Equivalente a process_image en Python)
 */
export async function classifyImage(imagePath: string, mimeType: string): Promise<string> {
  
  if (!imagePath) {
    throw new Error("imagePath no fue proporcionado");
  }

  if (!["image/png", "image/jpeg"].includes(mimeType)) {
    throw new Error("Tipo de archivo no soportado por el modelo");
  }

  try {
    // 1. Convertir la imagen guardada a una parte de la API
    const imagePart = fileToGenerativePart(imagePath, mimeType);

    // 2. Enviar el prompt y la imagen a Gemini
    const result = await model.generateContent([systemPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    if (text) {
      return text.trim();
    } else {
      throw new Error("La IA no generó una respuesta de texto.");
    }

  } catch (error) {
    console.error("Error llamando a la API de Gemini:", error);
    throw new Error(`Error en la API de IA: ${error instanceof Error ? error.message : String(error)}`);
  
  } finally {
    // 3. Eliminar el archivo temporal, igual que en tu código Python
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
}
