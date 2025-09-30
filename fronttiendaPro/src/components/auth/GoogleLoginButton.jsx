import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { loginSocial } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (response) => {
    try {
      const { credential } = response; 
      const decoded = jwtDecode(response.credential);


      const payload = {
        email: decoded.email,
        nombre: decoded.name,
        proveedor: "google",
        googleId: decoded.sub,
      };

      const data = await authService.loginSocial(payload);

      loginSocial(data.data); // guardamos tokens y usuario
    
      // Redirigir a Home después del login
      navigate("/");

    } catch (error) {
      console.error("Error en login social:", error);
    }
  };

  return <GoogleLogin 
    onSuccess={handleLogin} 
    onError={() => console.log("Login fallido")} />;
};

export default GoogleLoginButton;

