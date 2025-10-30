import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import os from 'os';
import authRoutes from './routes/authroutes';
import containerRoutes from './routes/containerroutes';
import truckRouteRoutes from './routes/truckrouteroutes';
import qrCodeRoutes from './routes/qrroutes';
import imageRoutes from './routes/geminiroutes';

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

connectDB(); 
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
const LOCAL_IP = getLocalIp();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API principal
app.use('/api/auth', authRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/routes', truckRouteRoutes);
app.use('/api/qrcodes', qrCodeRoutes);

// Ruta del clasificador
app.use('/api', imageRoutes);

// Iniciar el servidor Node
app.listen(PORT, HOST, () => {
  console.log(`Servidor Node corriendo en http://${HOST}:${PORT}`);
  console.log(`Accesible desde la red local en: http://${LOCAL_IP}:${PORT}`);
});

