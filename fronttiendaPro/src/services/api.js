import axios from 'axios';
import authService from './authService';

// Configuración base de Axios
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: agrega Authorization automáticamente
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: maneja expiración de token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos reintentado aún
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Llamamos a refresh token
        const data = await authService.refreshAccessToken();
        const newAccessToken = data.data.accessToken;

        // Guardamos el nuevo accessToken
        localStorage.setItem('accessToken', newAccessToken);

        // Reintentamos la request original con el token renovado
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh token, limpiar sesión
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('usuario');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;


