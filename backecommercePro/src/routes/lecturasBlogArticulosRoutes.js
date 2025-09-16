import { Router } from 'express';
import {
  getLecturas,
  getLecturaById,
  createLectura,
  updateLectura,
  deleteLectura
} from '../controllers/lecturasBlogArticulosController.js';

const router = Router();

router.get('/', getLecturas);
router.get('/:id', getLecturaById);
router.post('/', createLectura);
router.put('/:id', updateLectura);
router.delete('/:id', deleteLectura);

export default router;
