import { Router } from 'express';
import {
  getCuponesDescuento,
  getCuponDescuentoById,
  createCuponDescuento,
  updateCuponDescuento,
  deleteCuponDescuento,
  validarCuponGet,
  validarCuponPost
} from '../controllers/cuponesDescuentosController.js';

const router = Router();

router.get('/', getCuponesDescuento); // => GET /api/cuponesDescuentos

// Validación - rutas específicas primero
router.get('/validar/:codigoCupon', validarCuponGet);
router.post('/validar', validarCuponPost); // => GET /api/cuponesDescuentos/validar/:codigoCupon

router.get('/:id', getCuponDescuentoById); // => GET /api/cuponesDescuentos/:id
router.post('/', createCuponDescuento);
router.put('/:id', updateCuponDescuento);
router.delete('/:id', deleteCuponDescuento);


export default router;

/*
El orden de las rutas importa en Express porque las rutas se evalúan en orden.
Para solucionarlo, mové las rutas más específicas (como /validar/:codigoCupon) antes de las rutas con parámetros genéricos (/:id):
*/