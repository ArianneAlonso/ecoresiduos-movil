import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import os from 'os';
import { spawn } from 'child_process';
import fetch from 'node-fetch'; 
// Rutas propias del proyecto
import authRoutes from './routes/authroutes';
import containerRoutes from './routes/containerroutes';
import truckRouteRoutes from './routes/truckrouteroutes';
import qrCodeRoutes from './routes/qrroutes';

// --- Función para obtener la IP local ---
function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  for (const name of Object.keys(networkInterfaces)) {
    const nets = networkInterfaces[name];
    if (!nets) continue;

    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'IP_NO_ENCONTRADA';
}
// ----------------------------------------

// Configuración inicial
dotenv.config();
connectDB();
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
const LOCAL_IP = getLocalIp();

// Middlewares
app.use(cors());
app.use(express.json());

// 🚀 Iniciar el servidor Python (FastAPI de residuos)
console.log('Iniciando servidor Python (FastAPI)...');
const pythonProcess = spawn('python', ['./residuos/app.py'], {
  cwd: __dirname + '/..', // Nos aseguramos de que apunte al root del proyecto
  shell: true,
});

pythonProcess.stdout.on('data', (data) => {
  console.log(`[PYTHON] ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`[PYTHON ERROR] ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Servidor Python finalizó con código ${code}`);
});

// 🔗 (Opcional) Ruta proxy para enviar imágenes al clasificador de residuos (Gemini)
app.post('/api/classify', async (req, res) => {
  try {
    // ⚠️ En producción, manejá la carga de archivos con multer u otro middleware.
    // Esto es solo un ejemplo simple.
    const response = await fetch('http://localhost:8000/upload-image/', {
      method: 'POST',
      body: req.body, // suponiendo que ya envías el archivo desde frontend
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Error al comunicar con el servidor Python:', error);
    res.status(500).json({ error: 'Error interno al clasificar imagen' });
  }
});

// Rutas de la API principal
app.use('/api/auth', authRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/routes', truckRouteRoutes);
app.use('/api/qrcodes', qrCodeRoutes);

// Iniciar el servidor Node
app.listen(PORT, HOST, () => {
  console.log(`Servidor Node corriendo en http://${HOST}:${PORT}`);
  console.log(`Accesible desde la red local en: http://${LOCAL_IP}:${PORT}`);
});
