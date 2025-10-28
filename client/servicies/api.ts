import axios, { AxiosResponse } from 'axios';

// Interfaces de ejemplo (ajustalas según tu proyecto)
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
// CONFIGURACIÓN DE LA INSTANCIA DE AXIOS
// -----------------------------------------------------------------

const API_URL = 'http://10.254.197.246:3000/api';
//const API_URL = 'http://192.168.1.56:3000/api'; // casa

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------
// OBJETO API CENTRALIZADO
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
