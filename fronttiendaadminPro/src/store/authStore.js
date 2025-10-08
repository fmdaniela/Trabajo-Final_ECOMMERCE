import { create } from "zustand";
import authService from "../services/authService";
import api from "../services/api";
import { toast } from "react-toastify";         
import { getNavigator } from "../utils/navigation"; 


console.log("[AuthStore] Inicializando store de autenticación (ADMIN)");

const useAuthStore = create((set) => ({
  // ===== Estado inicial =====
  user: null,
  token: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,

  // ===== Limpiar errores =====
  clearError: () => set({ error: null }),

  // ===== Login administrador =====
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      console.log("[AuthStore] Iniciando login ADMIN", email);

      const data = await authService.loginAdmin({ email, password });

      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        set({
          user: data.data.user,
          token: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error durante login ADMIN:", error);
      set({
        error: error || "Error al iniciar sesión",
        isLoading: false,
      });
      return false;
    }
  },

  // ===== Logout (unificado con interceptor y checkAuth) =====
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  
    // toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", {
    //   position: "top-right",
    //   autoClose: 3000,
    // });
  
    const navigate = getNavigator();
    if (navigate) navigate("/login", { replace: true });
  },

  // ===== Verificar sesión (checkAuth) =====
  checkAuth: async () => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");

    // Si no hay token o refreshToken, cerrar sesión completa
    if (!token || !refresh) {
      console.warn("[AuthStore] No hay tokens válidos, cerrando sesión.");
      useAuthStore.getState().logout();
      return false;
    }

    set({ isLoading: true });

    try {
      const response = await api.get("/auth/dashboard");
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.log("Error en checkAuth ADMIN:", error);
      useAuthStore.getState().logout();
      return false;
    }
  },


  // ===== Refrescar token =====
  refreshAuthToken: async () => {
    try {
      const data = await authService.refreshAuthToken();
      console.log("[AuthStore] Token refrescado correctamente:", data);
      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        set({
          user: data.data.user,
          token: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          isAuthenticated: true,
        });

        return true;
      }
      return false;
    } catch (error) {
      console.log("Error refreshToken ADMIN:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      return false;
    }
  },
}));

export default useAuthStore;














