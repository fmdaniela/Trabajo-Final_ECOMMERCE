import API from './api'; // tu instancia de axios

const authService = {
  // ===== Login administrador =====
  loginAdmin: async (credenciales) => {
    try {
      const response = await API.post('/auth/loginAdmin', credenciales);
      return response.data; // devuelve data.data con accessToken y user
    } catch (error) {
      console.error('Error loginAdmin completo:', error);
      throw error.response?.data?.message || 'Error al iniciar sesión administrador';
    }
  },

  // ===== Refresh Token =====
  refreshAuthToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No hay refresh token guardado');

      const response = await API.post('/auth/refresh-token', { refreshToken });
      return response.data; // devuelve data.data con nuevos tokens y user
    } catch (error) {
      console.error('Error refreshAccessToken completo:', error);
      throw error.response?.data?.message || 'Error al refrescar token';
    }
  },
};

export default authService;
