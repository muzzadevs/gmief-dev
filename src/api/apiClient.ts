
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

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
