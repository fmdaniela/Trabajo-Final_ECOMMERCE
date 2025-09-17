import { Router } from 'express';

import rolesRoutes from './roles.Routes.js';
import categoriasRoutes from './categorias.Routes.js';
import administradoresRoutes from './administradores.Routes.js'; // CRUD de administradores


import authRoutes from './auth.Routes.js';  // login, register, refreshToken
import usuariosRoutes from './usuarios.Routes.js'; // CRUD de usuarios
import productosRoutes from './productos.Routes.js';


import telefonosRoutes from './telefonosRoutes.js';
import direccionesRoutes from './direccionesRoutes.js';
import ordenescomprasRoutes from './ordenescomprasRoutes.js';
import carritosRoutes from './carritosRoutes.js';
import pagosRoutes from './pagosRoutes.js';
import detallesOrdenesRoutes from './detallesOrdenesRoutes.js';
import detallesCarritosRoutes from './detallesCarritosRoutes.js';
import variantesProductosRoutes from './variantesProductosRoutes.js';
import movimientosStockRoutes from './movimientosStockRoutes.js';
import blogArticulosRoutes from './blogArticulosRoutes.js';
import lecturasBlogArticulosRoutes from './lecturasBlogArticulosRoutes.js';
import resenasRoutes from './resenasRoutes.js';
import cuponesDescuentosRoutes from './cuponesDescuentosRoutes.js';
import paisesRoutes from './paisesRoutes.js';
import imagenesProductosRoutes from './imagenesProductosRoutes.js';






const router = Router();

// Rutas de autenticación
router.use('/roles', rolesRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/administradores', administradoresRoutes);

router.use('/auth', authRoutes); 
router.use('/usuarios', usuariosRoutes);
router.use('/productos', productosRoutes);


router.use('/telefonos', telefonosRoutes); // monta las rutas definidas en router. va en plural
router.use('/direcciones', direccionesRoutes);
router.use('/ordenescompras', ordenescomprasRoutes);
router.use('/carritos', carritosRoutes);
router.use('/pagos', pagosRoutes);
router.use('/detallesOrdenes', detallesOrdenesRoutes);
router.use('/detallesCarritos', detallesCarritosRoutes);
router.use('/variantesProductos', variantesProductosRoutes); 
router.use('/movimientosStock', movimientosStockRoutes);
router.use('/blogArticulos', blogArticulosRoutes);
router.use('/lecturasBlogArticulos', lecturasBlogArticulosRoutes);
router.use('/resenas', resenasRoutes);
router.use('/cuponesDescuentos', cuponesDescuentosRoutes);
router.use('/paises', paisesRoutes);
router.use('/', imagenesProductosRoutes); // Monta sin prefijo imagenesProductos



export default router;
