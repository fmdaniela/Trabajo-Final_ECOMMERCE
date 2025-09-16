import { Router } from 'express';
import {
  getMovimientosStock,
  getMovimientoStockById,
  createMovimientoStock,
  updateMovimientoStock,
  deleteMovimientoStock
} from '../controllers/movimientosStockController.js';

const router = Router();

router.get('/', getMovimientosStock);
router.get('/:id', getMovimientoStockById);
router.post('/', createMovimientoStock);
router.put('/:id', updateMovimientoStock);
router.delete('/:id', deleteMovimientoStock);

export default router;
