import axios, { AxiosResponse } from 'axios';
import Constants from 'expo-constants';

// Interfaces
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// -----------------------------------------------------------------
// 📡 OBTENER IP AUTOMÁTICA
// -----------------------------------------------------------------
const getLocalApiUrl = () => {
  // Si estás en desarrollo con Expo, obtenemos la IP del host automáticamente
  const manifest = Constants.manifest;
  const expoConfig = Constants.expoConfig;

  // Expo SDK 48+ usa `expoConfig.hostUri`, versiones anteriores usan `manifest.debuggerHost`
  const debuggerHost =
    expoConfig?.hostUri || manifest?.debuggerHost || 'localhost:3000';

  const localIP = debuggerHost.split(':')[0]; // Tomamos solo la IP
  const baseURL = `http://${localIP}:3000/api`;

  return baseURL;
};

const API_URL = getLocalApiUrl();

console.log('🌐 Usando API URL:', API_URL);

// -----------------------------------------------------------------
// ⚙️ CONFIGURACIÓN DE AXIOS
// -----------------------------------------------------------------
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------
// 🧩 API CENTRALIZADA
// -----------------------------------------------------------------
const api = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
    try {
      console.log('🔄 Intentando login a:', API_URL + '/auth/login');
      const response = await apiClient.post('/auth/login', credentials);
      console.log('✅ Login exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error durante el login:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<any>> => {
    try {
      console.log('🔄 Intentando registro a:', API_URL + '/auth/register');
      const response = await apiClient.post('/auth/register', credentials);
      console.log('✅ Registro exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error durante el registro:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  getUsers: async (): Promise<ApiResponse<any[]>> => {
    try {
      console.log('🔄 Obteniendo usuarios de:', API_URL + '/users');
      const response = await apiClient.get('/users');
      console.log('✅ Usuarios obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      throw error;
    }
  },
};

export default api;
