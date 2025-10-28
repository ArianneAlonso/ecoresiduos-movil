import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import os from 'os';

//rutas
import authRoutes from './routes/authroutes';
import containerRoutes from './routes/containerroutes';
import truckRouteRoutes from './routes/truckrouteroutes';
import qrCodeRoutes from './routes/qrroutes';

// --- Función para obtener la IP local ---
function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  // Iteramos sobre todas las interfaces de red (Wi-Fi, Ethernet, etc.)
  for (const name of Object.keys(networkInterfaces)) {
    const nets = networkInterfaces[name];
    if (!nets) continue; // Si la interfaz no tiene redes, saltamos

    for (const net of nets) {
      // Buscamos la dirección IPv4 que no sea interna (como 127.0.0.1)
      if (net.family === 'IPv4' && !net.internal) {
        return net.address; // ¡La encontramos!
      }
    }
  }
  return 'IP_NO_ENCONTRADA'; // Fallback
}
// ----------------------------------------

// Configuración inicial
dotenv.config();
connectDB();
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0'; // Correcto para escuchar en todas las interfaces
const LOCAL_IP = getLocalIp(); // Obtenemos la IP dinámicamente

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/routes', truckRouteRoutes);
app.use('/api/qrcodes', qrCodeRoutes);

// Iniciar el servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
  // Usamos la variable LOCAL_IP que encontramos automáticamente
  console.log(`Accesible desde la red local en: http://${LOCAL_IP}:${PORT}`);
});

//  console.log(`Accesible desde la red local en: http://10.254.196.102:${PORT}`);