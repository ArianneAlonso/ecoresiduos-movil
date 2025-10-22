import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';

//rutas
import authRoutes from './routes/authroutes';
import containerRoutes from './routes/containerroutes';
import truckRouteRoutes from './routes/truckrouteroutes';
import qrCodeRoutes from './routes/qrroutes';

// Configuración inicial
dotenv.config();
connectDB();
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0'; // ✅ AGREGAR ESTA LÍNEA

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/routes', truckRouteRoutes);
app.use('/api/qrcodes', qrCodeRoutes);

// Iniciar el servidor
app.listen(PORT, HOST, () => { // ✅ AGREGAR HOST AQUÍ
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`Accesible desde la red local en: http://10.254.196.102:${PORT}`);
});