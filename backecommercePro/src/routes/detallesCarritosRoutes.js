import { Router } from 'express';
import {
  getDetallesCarrito,
  getDetalleCarritoById,
  createDetalleCarrito,
  updateDetalleCarrito,
  deleteDetalleCarrito
} from '../controllers/detallesCarritosController.js';

const router = Router();

router.get('/', getDetallesCarrito);
router.get('/:id', getDetalleCarritoById);
router.post('/', createDetalleCarrito);
router.put('/:id', updateDetalleCarrito);
router.delete('/:id', deleteDetalleCarrito);

export default router;
