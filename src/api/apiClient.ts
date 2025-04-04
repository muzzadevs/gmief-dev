
import axios from 'axios';

// Determinar la URL base según el entorno
let API_BASE_URL;

// En desarrollo, usar localhost:3001
if (import.meta.env.DEV) {
  API_BASE_URL = 'http://localhost:3001/api';
} 
// En producción, usar la ruta relativa
else {
  API_BASE_URL = '/api';
}

// Crear instancia de axios con interceptores para mejor manejo de errores
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para logs de peticiones
apiClient.interceptors.request.use(
  config => {
    console.log(`Realizando petición a: ${config.url}`);
    return config;
  },
  error => {
    console.error('Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logs y formateo de respuestas
apiClient.interceptors.response.use(
  response => {
    console.log(`Respuesta exitosa de: ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      console.error('Error de respuesta del servidor:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Ocurrió un error al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
