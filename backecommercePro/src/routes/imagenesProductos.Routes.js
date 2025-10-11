import { Router } from 'express';
import {
  obtenerImagenesPorProducto,
  agregarImagenPorProducto ,
  
} from '../controllers/imagenesProductos.Controller.js';

const router = Router();


router.get('/productos/:idProducto/imagenes', obtenerImagenesPorProducto); //GET  /api/productos/:idProducto/imagenes
router.post('/productos/:idProducto/imagenes', agregarImagenPorProducto); //POST /api/productos/:idProducto/imagenes

export default router;
