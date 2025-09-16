import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import GestionRoles from "./admin/gestion/GestionRoles";
import GestionAdministradores from "./admin/gestion/GestionAdministradores";
import GestionUsuarios from "./admin/gestion/GestionUsuarios";
import GestionCategorias from "./admin/gestion/GestionCategorias";

import GestionProductos from "./admin/gestion/GestionProductos";
import Login from "./admin/pages/Login"
import useAuthStore from "./store/authStore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Login público */}
        <Route path="/login" element={<Login />} />

        {/* Zona Admin protegida */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="roles" element={<GestionRoles />} />
          <Route path="categorias" element={<GestionCategorias />} />
          <Route path="administradores" element={<GestionAdministradores />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="productos" element={<GestionProductos />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>

      {/* Contenedor de Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
      
    </Router>
  );
}

export default App;
