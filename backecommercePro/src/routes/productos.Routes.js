import { Router } from 'express';

// ================= CONTROLADORES =================
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  obtenerProductosRelacionados,
  obtenerResenasPorProducto,
  crearResenaPorProducto,
} from '../controllers/productos.Controller.js';

import {
  obtenerMensajesPorProducto,
  crearMensajePorProducto,
} from '../controllers/mensajesController.js';

import { getVariantesPorProducto } from '../controllers/variantesPoductosController.js';

import {
  obtenerEtiquetasPorProducto,
  crearEtiquetaPorProducto,
} from '../controllers/etiquetasController.js';

// ================= MIDDLEWARES =================
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  validateIdParam,
  validateProductoCreate,
  validateProductoUpdate,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = Router();

// ================= RUTAS PRINCIPALES DE PRODUCTOS (ADMINISTRADORES) =================

// GET /api/productos - Listar todos (ADMIN y SUPERADMIN)
router.get('/', getProductos);

// GET /api/productos/:id - Obtener por ID
router.get( '/:id', validateIdParam('id'), handleValidationErrors, getProductoById);

// POST /api/productos - Crear producto
router.post('/', protect, authorize('ADMIN', 'SUPERADMIN'), validateProductoCreate, handleValidationErrors, createProducto);

// POST /api/etiquetas - Crear etiqueta
router.post('/:idProducto/etiquetas', protect, authorize('ADMIN','SUPERADMIN'), handleValidationErrors, crearEtiquetaPorProducto);

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', protect, authorize('ADMIN', 'SUPERADMIN'), validateIdParam, validateProductoUpdate, handleValidationErrors, updateProducto);

// DELETE /api/productos/:id - Eliminar producto (SOLO SUPERADMIN)
router.delete( '/:id', protect, authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, deleteProducto);


// ================= SUB-RECURSOS DE PRODUCTOS (USUARIOS- Clientas Tienda) =================

// GET /api/productos/:id/relacionados - Productos relacionados
router.get('/:id/relacionados', validateIdParam('id'), handleValidationErrors, obtenerProductosRelacionados);

// MENSAJES
// router.get('/:productoId/mensajes', validateIdParam('idProducto'), handleValidationErrors, obtenerMensajesPorProducto);
// router.post('/:productoId/mensajes', protect('USUARIO'), authorize('USER'), validateIdParam, handleValidationErrors, crearMensajePorProducto);

// VARIANTES
router.get('/:productoId/variantes', validateIdParam('productoId'), handleValidationErrors, getVariantesPorProducto);

// RESEÑAS
router.get('/:idProducto/resenas', validateIdParam('idProducto'), handleValidationErrors, obtenerResenasPorProducto);
router.post('/:idProducto/resenas', protect('USUARIO'), authorize('USER'), validateIdParam('idProducto'), handleValidationErrors, crearResenaPorProducto);

// ETIQUETAS
// router.get('/:idProducto/etiquetas', validateIdParam('idProducto'), handleValidationErrors, obtenerEtiquetasPorProducto);


export default router;





























// import { Router } from 'express';
// import {
//   getProductos,
//   getProductoById,
//   createProducto,
//   updateProducto,
//   deleteProducto,

  
//   obtenerProductosRelacionados,
//   obtenerResenasPorProducto,
//   crearResenaPorProducto
// } from '../controllers/productos.Controller.js';

// import {
//   obtenerMensajesPorProducto,
//   crearMensajePorProducto
// } from '../controllers/mensajesController.js';

// import {
//   getVariantesPorProducto
// } from '../controllers/variantesPoductosController.js';

// import {
//   obtenerEtiquetasPorProducto,
//   crearEtiquetaPorProducto
// } from '../controllers/etiquetasController.js'


// import { protect, authorize } from '../middleware/auth.middleware.js';
// import { 
//   validateIdParam, 
//   validateProductoCreate, 
//   validateProductoUpdate, 
//   handleValidationErrors 
// } from '../middleware/validation.js';

// const router = Router();

// // ================= PROTECCIÓN GENERAL =================
// // Todas las rutas requieren autenticación de ADMINISTRADOR
// router.use(protect('ADMINISTRADOR'));

// // ================= RUTAS =================

// // GET /api/productos - Listar todos los productos (ADMIN y SUPERADMIN)
// router.get('/', authorize('ADMIN','SUPERADMIN'), getProductos);

// // GET /api/productos/:id - Obtener producto por ID (ADMIN y SUPERADMIN)
// router.get('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, handleValidationErrors, getProductoById);

// // POST /api/productos - Crear producto (ADMIN y SUPERADMIN)
// router.post('/', authorize('ADMIN','SUPERADMIN'), validateProductoCreate, handleValidationErrors, createProducto);

// // PUT /api/productos/:id - Actualizar producto (ADMIN y SUPERADMIN)
// router.put('/:id', authorize('ADMIN','SUPERADMIN'), validateIdParam, validateProductoUpdate, handleValidationErrors, updateProducto);

// // DELETE /api/productos/:id - Eliminar producto (SOLO SUPERADMIN)
// router.delete('/:id', authorize('SUPERADMIN'), validateIdParam, handleValidationErrors, deleteProducto);



// // Ruta nueva para productos relacionados
// router.get('/:id/relacionados', obtenerProductosRelacionados); // GET http://localhost:3000/api/productos/1/relacionados

// //Rutas de mensajes asociadas a productos
// router.get('/:productoId/mensajes', obtenerMensajesPorProducto);
// router.post('/:productoId/mensajes', crearMensajePorProducto);

// //Ruta de variantes asociadas a un producto
// router.get('/:productoId/variantes', getVariantesPorProducto);

// //Rutas de resenas asociadas a un producto
// router.get('/:idProducto/resenas', obtenerResenasPorProducto); //GET http://localhost:3000/api/productos/2/resenas
// router.post('/:idProducto/resenas', crearResenaPorProducto); //POST http://localhost:3000/api/productos/2/resenas

// //Rutas de etiquetas asociadas a un producto
// router.get('/:idProducto/etiquetas', obtenerEtiquetasPorProducto); //GET http://localhost:3000/api/productos/2/etiquetas
// router.post('/:idProducto/etiquetas', crearEtiquetaPorProducto); //POST http://localhost:3000/api/productos/2/etiquetas


// export default router;
