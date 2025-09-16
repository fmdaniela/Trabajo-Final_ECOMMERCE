import { Router } from 'express';
import {
  getDirecciones,
  getDireccionById,
  createDireccion,
  updateDireccion,
  deleteDireccion
} from '../controllers/direccionesController.js';

const router = Router();

router.get('/', getDirecciones);
router.get('/:id', getDireccionById);
router.post('/', createDireccion);
router.put('/:id', updateDireccion);
router.delete('/:id', deleteDireccion);

export default router;
