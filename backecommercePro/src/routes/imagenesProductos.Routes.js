import { Router } from 'express';
import {
  obtenerImagenesPorProducto,
  agregarImagenPorProducto ,
  eliminarImagen,
} from '../controllers/imagenesProductos.Controller.js';

// ================= MIDDLEWARES =================
import { protect, authorize } from "../middleware/auth.middleware.js";


const router = Router();

// ==================================================
// 📌 BLOQUE PRIVADO (ADMIN / SUPERADMIN)
// ==================================================

// Nueva ruta DELETE
router.delete('/:id', eliminarImagen);


// ==================================================
// 📌 BLOQUE PÚBLICO (TIENDA ECOMMERCE)
// ==================================================

router.get('/productos/:idProducto/imagenes', obtenerImagenesPorProducto); //GET  /api/productos/:idProducto/imagenes
router.post('/productos/:idProducto/imagenes', agregarImagenPorProducto); //POST /api/productos/:idProducto/imagenes

export default router;
