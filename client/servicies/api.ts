import axios, { AxiosResponse } from 'axios';

// -----------------------------------------------------------------
// CONFIGURACIÓN PRINCIPAL
// -----------------------------------------------------------------

// ¡MUY IMPORTANTE!
// Esta es la IP de tu computadora (server)
// Cambia '3000' por el puerto que estés usando en tu backend (ej: 5000, 8000)
const API_URL = 'http://10.254.198.105:3000';

// -----------------------------------------------------------------
// DEFINICIÓN DE INTERFACES (TIPOS DE DATOS)
// -----------------------------------------------------------------

/**
 * Define la estructura de respuesta esperada de tu API.
 * Es bueno estandarizar esto; si tu API no devuelve
 * { data, status, message }, podés simplificarlo.
 */
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Datos necesarios para la función de login.
 */
interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Datos necesarios para la función de registro.
 */
interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  role: string;
}

// -----------------------------------------------------------------
// OBJETO API CENTRALIZADO
// -----------------------------------------------------------------

/**
 * Objeto que contiene todas las funciones para llamar a tu backend.
 * Importarás este objeto 'api' desde tus pantallas.
 */
const api = {

  /**
   * Intenta iniciar sesión en el servidor.
   * @param credentials Un objeto con 'username' y 'password'.
   * @returns La respuesta del servidor (ej: { data: { token: '...', user: {...} } })
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
    try {
      // Hacemos un POST a la ruta '/login' de tu backend
      const response: AxiosResponse = await axios.post(`${API_URL}/login`, credentials);
      return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error; // Lanza el error para que el 'catch' en la pantalla lo tome
    }
  },

  /**
   * Intenta registrar un nuevo usuario en el servidor.
   * @param credentials Un objeto con 'username', 'email', 'password' y 'role'.
   * @returns La respuesta del servidor (ej: { data: { message: 'Usuario creado' } })
   */
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<any>> => {
    try {
      // Hacemos un POST a la ruta '/register' de tu backend
      const response: AxiosResponse = await axios.post(`${API_URL}/register`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw error;
    }
  },

  /**
   * Ejemplo de cómo obtener datos (ej: lista de usuarios).
   * Esta es una ruta protegida que probablemente necesite un token.
   */
  getUsers: async (): Promise<ApiResponse<any[]>> => {
    try {
      // NOTA: Si esta ruta está protegida, necesitarás agregar
      // un "Authorization Header" con el token que guardaste en el login.
      const response: AxiosResponse = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // ... podés agregar más funciones aquí ...
  // ej: getProfile, updateProfile, etc.

};

// Exportamos el objeto para poder usarlo en otras partes de la app
export default api;