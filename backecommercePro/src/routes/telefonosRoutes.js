import { Router } from 'express';
import {
  getTelefonos,
  getTelefonoById,
  createTelefono,
  updateTelefono,
  deleteTelefono
} from '../controllers/telefonosController.js';

const router = Router();

router.get('/', getTelefonos);
router.get('/:id', getTelefonoById);
router.post('/', createTelefono);
router.put('/:id', updateTelefono);
router.delete('/:id', deleteTelefono);

export default router;
