import { Router } from 'express';
import {
  getCarritoActivo,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  finalizarCarrito
} from '../controllers/carritos.Controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = Router();


// ================= PROTECCIÓN GENERAL =================
// Todas las rutas requieren autenticación

router.use(protect('USUARIO'));

// Obtener el carrito activo de la usuaria
router.get('/activo', getCarritoActivo); // GET http://localhost:3000/api/carritos/activo

// Agregar un producto al carrito
router.post('/productos', agregarProducto); // POST http://localhost:3000/api/carritos/productos
// Body: { productoId, cantidad }

// Actualizar la cantidad de un producto en el carrito
router.put('/productos/:productoId', actualizarProducto); // PUT http://localhost:3000/api/carritos/productos/1
// Body: { cantidad }

// Eliminar un producto del carrito
router.delete('/productos/:productoId', eliminarProducto); // DELETE http://localhost:3000/api/carritos/productos/1

// Finalizar carrito → crear orden
router.post('/finalizar', finalizarCarrito); // POST http://localhost:3000/api/carritos/finalizar
// Body: { idDireccion }
  
export default router;


