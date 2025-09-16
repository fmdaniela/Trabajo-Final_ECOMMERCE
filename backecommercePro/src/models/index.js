import sequelize from '../db/connection.js';

import Administrador from './Administrador.js';
import Carrito from './Carrito.js';
import OrdenCompra from './OrdenCompra.js';
import Direccion from './Direccion.js';
import Telefono from './Telefono.js';
import Categoria from './Categoria.js';
import Producto from './Producto.js';
import Pago from './Pago.js';
import DetalleCarrito from './DetalleCarrito.js';
import DetalleOrden from './DetalleOrden.js';
import MovimientoStock from './MovimientoStock.js';
import VarianteProducto from './VarianteProducto.js';
import BlogArticulo from './BlogArticulo.js';
import LecturaBlogArticulo from './LecturaBlogArticulo.js';
import Resena from './Resena.js';
import CuponDescuento from './CuponDescuento.js';
import Pais from './Pais.js';
import Usuario from './Usuario.js';
import Mensaje from './Mensaje.js';
import ImagenProducto from './ImagenProducto.js';
import Etiqueta from './Etiqueta.js';
import Rol from './Rol.js';



// Asociaciones

// ============================
/* Relaciones 1:1 (Uno a Uno)*/
// ============================

// Carrito 1:1 OrdenCompra
Carrito.hasOne(OrdenCompra, { foreignKey: 'idCarrito' });
OrdenCompra.belongsTo(Carrito, { foreignKey: 'idCarrito', unique: true });
//Esa opción unique: true en belongsTo asegura que idCarrito no se repita (es decir, un carrito no puede estar en más de una orden).

// OrdenCompra 1:1 Pago
OrdenCompra.hasOne(Pago, { foreignKey: 'idOrdenCompra' });
Pago.belongsTo(OrdenCompra, { foreignKey: 'idOrdenCompra', unique: true });
//unique: true // asegura que no haya 2 pagos con la misma orden

// =================================
/* Relaciones 1:N (Uno a Muchos) */
// =================================

// Usuario 1:N Carrito
Usuario.hasMany(Carrito, { foreignKey: 'idUsuario' });
Carrito.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Usuario 1:N OrdenCompra
Usuario.hasMany(OrdenCompra, { foreignKey: 'idUsuario' });
OrdenCompra.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Usuario 1:N Direccion
Usuario.hasMany(Direccion, { foreignKey: 'idUsuario' });
Direccion.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Usuario 1:N Telefono 
Usuario.hasMany(Telefono, { foreignKey: 'idUsuario' });
Telefono.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Administrador 1:N BlogArticulo
Administrador.hasMany(BlogArticulo, { foreignKey: 'idAdministrador' });
BlogArticulo.belongsTo(Administrador, { foreignKey: 'idAdministrador' });

// Administrador 1:N Producto
Administrador.hasMany(Producto, { foreignKey: 'idAdministrador' });
Producto.belongsTo(Administrador, { foreignKey: 'idAdministrador' });

// Categoria 1:N Producto
Categoria.hasMany(Producto, { foreignKey: 'idCategoria' });
Producto.belongsTo(Categoria, { foreignKey: 'idCategoria' });

// Producto 1:N VarianteProducto 
Producto.hasMany(VarianteProducto, { foreignKey: 'idProducto', as: 'variantes'});
VarianteProducto.belongsTo(Producto, { foreignKey: 'idProducto', as: 'productoVariante' });

// VarianteProducto 1:N MovimientoStock
VarianteProducto.hasMany(MovimientoStock, { foreignKey: 'idVarianteProducto' });
MovimientoStock.belongsTo(VarianteProducto, { foreignKey: 'idVarianteProducto' });

// Administrador 1:N MovimientoStock
Administrador.hasMany(MovimientoStock, { foreignKey: 'idAdministrador' });
MovimientoStock.belongsTo(Administrador, { foreignKey: 'idAdministrador' });

// OrdenCompra 1:N MovimientoStock
OrdenCompra.hasMany(MovimientoStock, { foreignKey: 'idOrdenCompra' });
MovimientoStock.belongsTo(OrdenCompra, { foreignKey: 'idOrdenCompra' });

// Usuario 1:N Resena
Usuario.hasMany(Resena, { foreignKey: 'idUsuario' });
Resena.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Producto 1:N Resena
Producto.hasMany(Resena, { foreignKey: 'idProducto' });
Resena.belongsTo(Producto, { foreignKey: 'idProducto' });

// Direccion 1:N OrdenCompra
Direccion.hasMany(OrdenCompra, { foreignKey: 'idDireccion' });
OrdenCompra.belongsTo(Direccion, { foreignKey: 'idDireccion' });


// ===================================
/* Relaciones N:M (Muchos a Muchos) */
// ===================================

// OrdenCompra N:M Producto
// OrdenCompra: DetalleOrden
OrdenCompra.hasMany(DetalleOrden, { foreignKey: 'idOrdenCompra' });
DetalleOrden.belongsTo(OrdenCompra, { foreignKey: 'idOrdenCompra' });

// Producto: DetalleOrden
Producto.hasMany(DetalleOrden, { foreignKey: 'idProducto' });
DetalleOrden.belongsTo(Producto, { foreignKey: 'idProducto' });


// Carrito N:M Producto
//Carrito: DetalleCarrito
Carrito.hasMany(DetalleCarrito, { foreignKey: 'idCarrito' });
DetalleCarrito.belongsTo(Carrito, { foreignKey: 'idCarrito' });

//Producto: DetalleCarrito
Producto.hasMany(DetalleCarrito, { foreignKey: 'idProducto' });
DetalleCarrito.belongsTo(Producto, { foreignKey: 'idProducto' });
//No hay que usar belongsToMany() porque necesitamos almacenar más información que solo las FK.


// Usuario N:M BlogArticulo
// Usuario: LecturaBlogArticulo
Usuario.hasMany(LecturaBlogArticulo, { foreignKey: 'idUsuario' });
LecturaBlogArticulo.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// BlogArticulo: LecturaBlogArticulo
BlogArticulo.hasMany(LecturaBlogArticulo, { foreignKey: 'idBlog' });
LecturaBlogArticulo.belongsTo(BlogArticulo, { foreignKey: 'idBlog' });


// ===================================
/*Relaciones de practicas realizadas*/
// ===================================

//Producto 1:N ImagenProducto
Producto.hasMany(ImagenProducto, {foreignKey: 'idProducto', as: 'imagenes'});
ImagenProducto.belongsTo(Producto, { foreignKey: 'idProducto', as: 'productoImagen'});

// Producto 1:N Etiqueta
Producto.hasMany(Etiqueta, { foreignKey: 'idProducto', as: 'etiquetas' });
Etiqueta.belongsTo(Producto, { foreignKey: 'idProducto', as: 'productoEtiqueta' });

// // Producto 1:N Mensaje
Producto.hasMany(Mensaje, { foreignKey: 'idProducto' });
Mensaje.belongsTo(Producto, { foreignKey: 'idProducto' });

// =====================
/* Relaciones Roles */
// =====================

Usuario.belongsTo(Rol, { foreignKey: 'idRol', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'idRol', as: 'usuarios' });
//cada usuario tiene un rol, un rol puede tener muchos usuarios. Esto sirve para manejar permisos.

Administrador.belongsTo(Rol, { foreignKey: 'idRol', as: 'rol' });
Rol.hasMany(Administrador, { foreignKey: 'idRol', as: 'administrador' });
//cada Administrador tiene un rol, un rol puede tener muchos administradores. Esto sirve para manejar permisos.



export {
  sequelize,
  Usuario,
  Administrador,
  Rol,
  Producto,
  Categoria,
  Carrito,
  OrdenCompra,
  Direccion,
  Telefono,
  Pago,
  MovimientoStock,
  VarianteProducto,
  ImagenProducto,
  Etiqueta,
  Resena,
  BlogArticulo,
  LecturaBlogArticulo,
  Mensaje,
  CuponDescuento,
  Pais,
  DetalleCarrito,
  DetalleOrden  
  
 
  
  };
