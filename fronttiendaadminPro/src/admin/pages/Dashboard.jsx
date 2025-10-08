import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Package, Users, Tag, Shield, Key } from "lucide-react";
import dashboardService from "../../services/dashboardService";
import DashboardChart from "../components/DashboardChart";


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, checkAuth, isLoading } = useAuthStore();
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Máximos para calcular el progress
  const [MAX, setMAX] = useState({
    roles: 10,
    administradores: 15,
    usuarios: 50,
    categorias: 10,
    productos: 50,
  });

  // Verificar sesión
  useEffect(() => {
    const verify = async () => {
      const ok = await checkAuth();

      if (!ok) navigate("/admin/login");
    };
    verify();
  }, [checkAuth, navigate]);

  // Traer estadísticas reales
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();

        setStats([
          {
            label: "Roles",
            value: data.roles,
            description: "Cantidad de roles configurados",
            icon: Key,
            progress: Math.min((data.roles / MAX.roles) * 100, 100),
          },
          {
            label: "Administradores",
            value: data.administradores,
            description: "Cantidad de administradores activos",
            icon: Shield,
            progress: Math.min((data.administradores / MAX.administradores) * 100, 100),
          },
          {
            label: "Usuarios",
            value: data.usuarios,
            description: "Cantidad de usuarios registrados",
            icon: Users,
            progress: Math.min((data.usuarios / MAX.usuarios) * 100, 100),
          },
          {
            label: "Categorías",
            value: data.categorias,
            description: "Cantidad de categorías creadas",
            icon: Tag,
            progress: Math.min((data.categorias / MAX.categorias) * 100, 100),
          },
          {
            label: "Productos",
            value: data.productos,
            description: "Cantidad de productos en el catálogo",
            icon: Package,
            progress: Math.min((data.productos / MAX.productos) * 100, 100),
          },
        ]);

      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [MAX]);

  if (isLoading || loadingStats) return <p className="text-white">Cargando...</p>;

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-50">
            Bienvenido, {user?.nombre || "Administrador"}
          </h1>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(({ label, value, description, icon: Icon, progress }) => (
            <div key={label} className="bg-white shadow rounded-lg p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Icon className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg font-semibold text-slate-800">{label}</span>
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-1">{value}</div>
              <div className="text-sm text-slate-500 mb-3">{description}</div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        

        {/* Gráfico resumen */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-cyan-50 mb-4">Resumen general</h2>
          <DashboardChart />
        </div>

        {/* Accesos rápidos */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Roles", icon: Key, path: "/admin/roles" },
            { label: "Administradores", icon: Shield, path: "/admin/administradores" },
            { label: "Usuarios", icon: Users, path: "/admin/usuarios" },
            { label: "Categorías", icon: Tag, path: "/admin/categorias" },
            { label: "Productos", icon: Package, path: "/admin/productos" },
          ].map(({ label, icon: Icon, path }) => (
            <div
              key={label}
              onClick={() => navigate(path)}
              className="cursor-pointer bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center  hover:bg-blue-100 transition"
            > 
              <Icon className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-slate-800">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;





