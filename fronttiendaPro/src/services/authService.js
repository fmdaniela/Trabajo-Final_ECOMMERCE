import API from './api';

const authService = {
  // ===== Registro =====
  registrarUsuario: async (datos) => {
    try {
      const response = await API.post('/auth/registerUsuario', datos);
      return response.data;
    } catch (error) {
      console.error('Error completo:', error);
      throw error.response?.data?.message || 'Error al registrarse';
    }
  },

  // ===== Login =====
  loginUsuario: async (credenciales) => {
    try {
      const response = await API.post('/auth/loginUsuario', credenciales);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  },

  loginAdmin: async (credenciales) => {
    try {
      const response = await API.post('/auth/loginAdmin', credenciales);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al iniciar sesión administrador';
    }
  },

  // ===== Login Social =====
  loginSocial: async (datos) => {
  try {
      const response = await API.post('/auth/loginSocial', datos);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error en login social';
    }
  },

  // ===== Refresh Token =====
  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await API.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};

export default authService;
