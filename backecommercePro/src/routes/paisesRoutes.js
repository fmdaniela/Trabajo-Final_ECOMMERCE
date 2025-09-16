import { Router } from 'express';
import {
  getPaises,
  buscarPaisPorNombre,
  getPaisById,
  createPais,
  updatePais,
  deletePais
} from '../controllers/paisesController.js';

const router = Router();

router.get('/', getPaises);
router.get('/buscar/:nombre', buscarPaisPorNombre);
router.get('/:id', getPaisById);
router.post('/', createPais);
router.put('/:id', updatePais);
router.delete('/:id', deletePais);

export default router;