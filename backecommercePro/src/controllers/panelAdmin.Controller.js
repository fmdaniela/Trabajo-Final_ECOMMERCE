import { Rol, Administrador, Usuario, Categoria, Producto } from "../models/index.js";

export const getDashboardStats = async (req, res) => {
  try {
      const stats = {
      roles: await Rol.count(),
      administradores: await Administrador.count(),
      usuarios: await Usuario.count(),
      categorias: await Categoria.count(),
      productos: await Producto.count(),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error obteniendo estadísticas del dashboard:", error);
    res.status(500).json({ error: "Error al cargar las estadísticas" });
  }
};


