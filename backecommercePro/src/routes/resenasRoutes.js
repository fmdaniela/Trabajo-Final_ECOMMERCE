import express from 'express';
import {
  getResenas,
  getResenaById,
  createResena,
  updateResena,
  deleteResena
} from '../controllers/resenasController.js';

const router = express.Router();

router.get('/', getResenas);
router.get('/:id', getResenaById);
router.post('/', createResena);
router.put('/:id', updateResena);
router.delete('/:id', deleteResena);

export default router;
