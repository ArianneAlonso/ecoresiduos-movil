import { GoogleGenerativeAI } from "@google/generative-ai";

// Cargar la API key desde las variables de entorno
const apiKey = process.env.GENAI_API_KEY;
if (!apiKey) {
  throw new Error("GENAI_API_KEY no está definida en las variables de entorno.");
}

// Este es tu prompt actualizado
export const systemPrompt = `
Eres un asistente encargado de clasificar si una imagen contiente un elemento reciclable o no reciclable.
Responde con "Reciclable" o "No Reciclable" según corresponda y el tipo de material que es como: carton, vidrio, plastico, etc.  sin explicaciones adicionales.
`;

// Modelo que especificaste en tu código Python
export const modelName = "gemini-2.5-flash";

// Inicializamos el cliente de IA
const genAI = new GoogleGenerativeAI(apiKey);

// Obtenemos el modelo generativo y lo exportamos para usarlo en los servicios
export const model = genAI.getGenerativeModel({ model: modelName });