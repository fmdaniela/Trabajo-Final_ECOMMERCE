import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password }); // AuthProvider maneja todo
      navigate("/"); // Redirige a Home después de login
    } catch (err) {
      console.error("Error en login:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message); // Mensaje del backend
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Credenciales inválidas. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600">Iniciar Sesión</h2>
        <p className="text-gray-600">Accede a tu cuenta Vitalia</p>
      </div>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-fuchsia-800 underline">
          Registrate aquí
        </Link>
      </p>
    </div>
  );
}

export default Login;


/*
login dentro del AuthProvider ya llama a authService.loginUsuario o authService.loginAdmin según corresponda.
Esto te permite centralizar la lógica de sesión (guardar tokens, actualizar estado, etc.) en un solo lugar (AuthProvider).
Si importáramos authService directamente en Login.jsx, duplicaríamos la lógica de manejo de sesión y localStorage.

Resumen:
Antes: Login.jsx llamaba directo a authService, guardaba tokens y usuario en localStorage.
Ahora: Login.jsx solo llama login() del AuthProvider → todo lo demás (tokens, localStorage, estado) queda centralizado.
*/















