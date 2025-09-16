import { Router } from 'express';
import {
  getOrdenesCompra,
  getOrdenCompraById,
  createOrdenCompra,
  updateOrdenCompra,
  deleteOrdenCompra
} from '../controllers/ordenesComprasController.js';

const router = Router();

router.get('/', getOrdenesCompra);
router.get('/:id', getOrdenCompraById);
router.post('/', createOrdenCompra);
router.put('/:id', updateOrdenCompra);
router.delete('/:id', deleteOrdenCompra);

export default router;
