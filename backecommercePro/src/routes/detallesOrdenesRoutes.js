import { Router } from 'express';
import {
  getDetallesOrden,
  getDetalleOrdenById,
  createDetalleOrden,
  updateDetalleOrden,
  deleteDetalleOrden
} from '../controllers/detallesOrdenesController.js';

const router = Router();

router.get('/', getDetallesOrden);
router.get('/:id', getDetalleOrdenById);
router.post('/', createDetalleOrden);
router.put('/:id', updateDetalleOrden);
router.delete('/:id', deleteDetalleOrden);

export default router;
