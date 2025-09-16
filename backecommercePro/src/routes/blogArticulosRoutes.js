import { Router } from 'express';
import {
  getBlogArticulos,
  getBlogArticuloById,
  createBlogArticulo,
  updateBlogArticulo,
  deleteBlogArticulo
} from '../controllers/blogArticulosController.js';

const router = Router();

router.get('/', getBlogArticulos);
router.get('/:id', getBlogArticuloById);
router.post('/', createBlogArticulo);
router.put('/:id', updateBlogArticulo);
router.delete('/:id', deleteBlogArticulo);

export default router;
