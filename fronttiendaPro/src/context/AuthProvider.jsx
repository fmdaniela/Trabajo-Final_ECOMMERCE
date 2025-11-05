import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import authService from "../services/authService";

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Restaurar usuario desde localStorage al montar el Provider
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  const registerUsuario = useCallback(async (datos) => {
    try {
      const data = await authService.registrarUsuario(datos);
      return { success: true, data };
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, message: error || "Error al registrarse" };
    }
  }, []);

  const login = useCallback(async (credenciales, tipo = "USUARIO") => {
    try {
      let data;
      if (tipo === "USUARIO") {
        data = await authService.loginUsuario(credenciales);
      } else {
        data = await authService.loginAdmin(credenciales);
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.data.user));
      setUsuario(data.data.user);

      return { success: true, data };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: error || "Error al iniciar sesión" };
    }
  }, []);

  const loginSocial = useCallback((data) => {
    const { accessToken, refreshToken, user } = data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("usuario", JSON.stringify(user));

    setUsuario(user);
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("refreshToken");
      if (!token) return { success: false, message: "No hay token de refresco" };
    
      const data = await authService.refreshAccessToken(token);
    
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.data.user));
      setUsuario(data.data.user);
    
      return { success: true, data: data.data.accessToken };
    } catch (error) {
      console.error("Error al refrescar token:", error);
      return { success: false, message: error || "Error al refrescar token" };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, refreshToken, registerUsuario, loginSocial }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

