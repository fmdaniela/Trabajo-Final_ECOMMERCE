import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import authService from "../services/authService";

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Restaurar usuario desde localStorage al montar el Provider. 
  //Esto asegura que si el usuario recarga la página, no pierda la sesión.
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  // ===== Registro Usuario =====
  const registerUsuario = useCallback(async (datos) => {
    const data = await authService.registrarUsuario(datos);
    return data; // Esto permite que Register.jsx reciba la respuesta
  }, []);

  // ===== Login Usuario/Admin =====
  const login = useCallback(async (credenciales, tipo = "USUARIO") => {
    let data;
    if (tipo === "USUARIO") {
      data = await authService.loginUsuario(credenciales);
    } else {
      data = await authService.loginAdmin(credenciales);
    }

    // Guardar tokens y usuario en localStorage
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    localStorage.setItem("usuario", JSON.stringify(data.data.user));
    setUsuario(data.data.user);

    return data;
  }, []);

  // ===== Logout =====
  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  // ===== Refresh Token manual =====
  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem("refreshToken");
    if (!token) return null;

    const data = await authService.refreshAccessToken(token);

    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    localStorage.setItem("usuario", JSON.stringify(data.data.user));
    setUsuario(data.data.user);

    return data.data.accessToken;
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, refreshToken, registerUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


/*
AuthProvider centraliza toda la lógica de autenticación:
- Registro (registerUsuario)
- Login (usuario o admin) con almacenamiento de tokens y usuario
- Logout (limpia sesión)
- Refresh token manual

Ventaja: evita duplicación de lógica en componentes como Login.jsx o Register.jsx.
*/