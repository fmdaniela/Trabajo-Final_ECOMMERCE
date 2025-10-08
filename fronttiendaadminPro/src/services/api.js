import axios from "axios";
import useAuthStore from "../store/authStore";

console.log("[API] Inicializando servicio API");

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

if (import.meta.env.DEV) {
  console.log("[API] URL:", API_URL);
}

let isRefreshing = false;

// ===== Interceptor de request =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    config.metadata = { startTime: performance.now() };
    console.log(`[API] → ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Interceptor de respuesta =====
api.interceptors.response.use(
  (response) => {
    const { config } = response;
    if (config.metadata?.startTime) {
      const duration = performance.now() - config.metadata.startTime;
      console.log(`[API] ✅ Respuesta de ${config.url} en ${duration.toFixed(2)}ms`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    if (error.response?.status === 401) {
      // ⚡ Token expirado
      if (originalRequest._retry || isRefreshing) {
        console.log("[API] Refresh token ya falló o está en proceso. Logout con toast");
        authStore.logout(true); // expired = true → toast
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log("[API] Token expirado, intentando refrescar...");

      const success = await authStore.refreshAuthToken();
      isRefreshing = false;

      if (success) {
        console.log("[API] ✅ Refresh exitoso. Reintentando petición...");
        const newToken = localStorage.getItem("accessToken");
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        console.log("[API] ❌ No se pudo refrescar token. Logout con toast...");
        authStore.logout(true); // expired = true → toast
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;






















