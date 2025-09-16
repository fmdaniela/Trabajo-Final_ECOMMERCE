import axios from 'axios';

console.log('[API] Inicializando servicio API');

// Obtener la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    //'Content-Type': 'application/json',
  }
});

// Log para verificar qué URL está siendo utilizada (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    console.log(`[API] Enviando petición ${config.method.toUpperCase()} a ${config.url}`);
    const startTime = performance.now();
    config.metadata = { startTime };
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API] Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    const { config } = response;
    if (config.metadata && config.metadata.startTime) {
      const duration = performance.now() - config.metadata.startTime;
      console.log(`[API] Respuesta recibida de ${config.url} en ${duration.toFixed(2)}ms`);
    }
    return response;
  },
  (error) => {
    const { config } = error;
    if (config && config.metadata && config.metadata.startTime) {
      const duration = performance.now() - config.metadata.startTime;
      console.log(`[API] Error en petición a ${config.url} después de ${duration.toFixed(2)}ms`);
      console.log(`[API] Código de error: ${error.response?.status || 'Sin respuesta'}`); 
    }
    
    // Si el error es 401 (no autorizado), redirigir al login
    if (error.response && error.response.status === 401) {
      console.log('[API] Error 401: No autorizado, redirigiendo a login');
      localStorage.removeItem('token');
      //window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
