import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    // Si NO hay usuario → redirigir al login
    return <Navigate to="/login" />;
  }

  // Si hay usuario → mostrar el contenido protegido
  return children;
}

export default PrivateRoute;
