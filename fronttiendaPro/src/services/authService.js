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


  registrarAdmin: async (datos) => {
    try {
      const response = await API.post('/auth/registerAdmin', datos);
      return response.data;
    } catch (error) {
      console.error('Error completo:', error);
      throw error.response?.data?.message || 'Error al registrar administrador';
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

  // ===== Refresh Token =====
  refreshAccessToken: async (token) => {
    try {
      const response = await API.post('/auth/refreshToken', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al refrescar token';
    }
  },
};

export default authService;
