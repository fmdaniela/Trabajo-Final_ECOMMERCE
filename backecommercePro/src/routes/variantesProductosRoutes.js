//No lo usamos porque montamos las rutas en productosRoutes.js
import { Router } from 'express';
import {
  getVariantesProducto,
  getVarianteProductoById,
  createVarianteProducto,
  updateVarianteProducto,
  deleteVarianteProducto,
  
} from '../controllers/variantesPoductosController.js';

const router = Router();

router.get('/', getVariantesProducto); // GET http://localhost:3000/api/variantesProductos
router.get('/:id', getVarianteProductoById); //GET http://localhost:3000/api/variantesProductos/1
router.post('/', createVarianteProducto); //POST http://localhost:3000/api/variantesProductos
router.put('/:id', updateVarianteProducto); //PUT http://localhost:3000/api/variantesProductos/1
router.delete('/:id', deleteVarianteProducto); //DELETE http://localhost:3000/api/variantesProductos/1

export default router;
