
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Base de datos en memoria
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
}

let users: User[] = [];
let nextId = 1;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Funciones auxiliares
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

const findUserByUsernameOrEmail = (identifier: string): User | undefined => {
  return users.find(user => 
    (user.username === identifier || user.email === identifier) && user.isActive
  );
};

const findUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id && user.isActive);
};

const userExists = (username: string, email: string): boolean => {
  return users.some(user => user.username === username || user.email === email);
};

// Middleware de autenticación
const authenticate = (req: any, res: any, next: any) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.'
      });
    }

    const decoded = verifyToken(token);
    const user = findUserById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o usuario inactivo.'
      });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};

// RUTAS

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: 'En memoria'
  });
});

// Info de la API
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API de Login/Registro',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/user/profile (requiere token)',
      users: 'GET /api/debug/users',
      clear: 'DELETE /api/debug/clear'
    },
    version: '1.0.0',
    usersCount: users.length
  });
});

// Registro de usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email y password son requeridos'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El username debe tener al menos 3 caracteres'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'El password debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    if (userExists(username, email)) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario
    const newUser: User = {
      id: nextId++,
      username,
      email,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generar token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login de usuario
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones básicas
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }

    // Buscar usuario
    const user = findUserByUsernameOrEmail(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Forgot password (simulado)
app.post('/api/auth/forgot-password', (req, res) => {
  res.json({
    success: true,
    message: 'Si el email existe, recibirías instrucciones para restablecer tu contraseña (simulado en memoria)'
  });
});

// Obtener perfil de usuario (ruta protegida)
app.get('/api/user/profile', authenticate, (req: any, res) => {
  res.json({
    success: true,
    message: 'Perfil obtenido exitosamente',
    user: req.user
  });
});

// Rutas de debug
app.get('/api/debug/users', (req, res) => {
  const usersWithoutPasswords = users.map(user => ({
    ...user,
    password: '[OCULTO]'
  }));
  
  res.json({
    success: true,
    message: 'Lista de usuarios en memoria',
    users: usersWithoutPasswords,
    count: users.length
  });
});

app.delete('/api/debug/clear', (req, res) => {
  users = [];
  nextId = 1;
  res.json({
    success: true,
    message: 'Base de datos limpiada'
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejo de errores globales
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Obtener IP local
const getLocalIP = () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Red local: http://${localIP}:${PORT}`);
  console.log('Base de datos: En memoria');
  console.log('Health check: GET /health');
  console.log('Auth API: POST /api/auth/register, POST /api/auth/login');
  console.log('User API: GET /api/user/profile (token required)');
  console.log('Debug: GET /api/debug/users, DELETE /api/debug/clear');
  console.log('Info: GET /api/info');
  console.log('\nPara tu compañera:');
  console.log(`http://${localIP}:${PORT}`);
  console.log('\nTest rápido:');
  console.log(`curl http://localhost:${PORT}/health`);
});

export default app;