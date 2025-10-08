import { Producto, Categoria, Resena } from '../models/index.js';
import { Op } from "sequelize";


// ==================================================
// 📌 BLOQUE PRIVADO (PANEL ADMIN)
// ==================================================

// GET todos los productos (activos e inactivos) con paginación
export const adminGetProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoriaId, activo, sort = 'fechaCreacion', direction = 'DESC', search } = req.query;
    const offset = (page - 1) * limit;

    // --- Filtro ---
    const whereClause = {};
    if (activo !== undefined) whereClause.activo = activo === 'true';
    if (categoriaId) whereClause.idCategoria = categoriaId;
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
      ];
    }
    

    // --- Validación de columna para ordenar ---
    const validSortFields = ['nombre', 'descripcion', 'precio', 'activo', 'fechaCreacion'];
    const sortColumn = validSortFields.includes(sort) ? sort : 'fechaCreacion';
    const sortDirection = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // --- Consulta con paginación y join a categoría ---
    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'descripcion']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortColumn, sortDirection]]
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error en adminGetProductos:', err);
    res.status(500).json({
      success: false,
      message: 'No se pudieron obtener los productos'
    });
  }
};


// GET producto por id (incluye inactivos)
export const adminGetProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto (admin):", error);
    res.status(500).json({ error: "Error al obtener producto (admin)" });
  }
};

// POST crear producto
export const createProducto = async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// PUT actualizar producto
export const updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// DELETE → baja lógica (activo = false)
export const adminDeleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.update({ activo: false });
    res.json({ message: "Producto dado de baja (soft delete)" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// PATCH → alternar activo/inactivo
export const toggleProductoActivo = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.update({ activo: !producto.activo });
    res.json({ message: "Estado del producto actualizado", producto });
  } catch (error) {
    console.error("Error al cambiar estado del producto:", error);
    res.status(500).json({ error: "Error al cambiar estado del producto" });
  }
};

// Restaurar producto
export const restoreProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

    producto.activo = true;
    await producto.save();

    res.json({ success: true, message: 'Producto restaurado con éxito' });
  } catch (err) {
    console.error('Error restaurando producto:', err);
    res.status(500).json({ success: false, message: 'No se pudo restaurar el producto' });
  }
};

// ==================================================
// 📌 BLOQUE PÚBLICO (TIENDA ECOMMERCE)
// ==================================================

// GET productos activos
export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { activo: true } });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// GET producto por id (solo si está activo)
export const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findOne({
      where: { id: req.params.id, activo: true }
    });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

// GET productos relacionados por categoría
export const obtenerProductosRelacionados = async (req, res) => {
  try {
    const { id } = req.params;

    const productoActual = await Producto.findByPk(id);
    if (!productoActual) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productosRelacionados = await Producto.findAll({
      where: {
        idCategoria: productoActual.idCategoria,
        id: { [Op.ne]: id }, // excluye el producto actual
      },
      limit: 3,
      include: [{ model: Categoria, as: "categoria"}],
    });

    res.status(200).json(productosRelacionados);
  } catch (error) {
    console.error('Error al obtener productos relacionados', error);
    res.status(500).json({message: 'Error al obtener productos relacionados', error: error.message});
  }
};

 
// GET reseñas de un producto
export const obtenerResenasPorProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const resenas = await Resena.findAll({
      where: { idProducto },
      order: [['fechaResena', 'DESC']],
    });
    res.status(200).json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas del producto', error);
    res.status(500).json({ message: 'Error al obtener reseñas del producto', error: error.message });
  }
};

// POST crear una nueva reseña de un producto
export const crearResenaPorProducto = async (req, res) => {
  try {
    console.log("📩 Body recibido:", req.body);
    console.log("🛒 Params:", req.params);
    const { idProducto }= req.params; // aqui obtenemos el idProducto desde la URL con req.params
    const { calificacion, comentario, idUsuario } = req.body;
    const nuevaResena = await Resena.create({
      idProducto, // declaramos el idProducto más allá q lo obtenemos de la URL(req.params) xq estamos creando una reseña nueva y Sequelize necesita saber qué idProducto asociar a esa reseña. Pero este atributo no se incluye en el JSON del body para hacer POST xq ya lo estamos extrayendo de req.params
      calificacion,
      comentario,
      idUsuario,
    });

    console.log("✅ Respuesta a enviar:", nuevaResena);
    res.status(201).json(nuevaResena);
  } catch (error) {
    console.log('Error al crear reseña', error);
    res.status(500).json({ message: 'Error al crear reseña', error: error.message});
  }
}












// // GET productos relacionados por categoría
// export const obtenerProductosRelacionados = async (req, res) => {
//   try {
//     const producto = await Producto.findByPk(req.params.id);
//     if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

//     const relacionados = await Producto.findAll({
//       where: {
//         categoria: producto.categoria,
//         id: { $ne: producto.id },
//         activo: true
//       }
//     });

//     res.json(relacionados);
//   } catch (error) {
//     console.error("Error al obtener productos relacionados:", error);
//     res.status(500).json({ error: "Error al obtener productos relacionados" });
//   }
// };

// // GET reseñas de un producto
// export const obtenerResenasPorProducto = async (req, res) => {
//   try {
//     const resenas = await Resena.findAll({
//       where: { idProducto },
//       order: [['fechaResena', 'DESC']],
//     });
//     res.json(resenas);
//   } catch (error) {
//     console.error("Error al obtener reseñas:", error);
//     res.status(500).json({ error: "Error al obtener reseñas" });
//   }
// };

// // POST crear reseña de un producto
// export const crearResenaPorProducto = async (req, res) => {
//   try {
//     const { calificacion, comentario } = req.body;
//     const { idProducto } = req.params;

//     const nuevaResena = await Resena.create({
//       calificacion,
//       comentario,
//       idProducto 
//     });

//     res.status(201).json(nuevaResena);
//   } catch (error) {
//     console.error("Error al crear reseña:", error);
//     res.status(500).json({ error: "Error al crear reseña" });
//   }
// };








// import { Producto, Categoria, VarianteProducto, ImagenProducto, Resena } from '../models/index.js';
// import { Op } from "sequelize";

// // ===== Obtener todos los productos =====
// export const getProductos = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, categoriaId, activo = true } = req.query;
//     const offset = (page - 1) * limit;

//     const whereClause = { activo };
//     if (categoriaId) whereClause.categoriaId = categoriaId;

//     const productos = await Producto.findAndCountAll({
//       include: [{
//         model: Categoria,
//         as: 'categoria',
//         attributes: ['id', 'nombre', 'descripcion']
//       }],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order: [['fechaCreacion', 'DESC']]
//     });

//     res.json({
//       success: true,
//       data: productos.rows,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(productos.count / limit),
//         totalItems: productos.count,
//         itemsPerPage: parseInt(limit)
//       }
//     });
//   } catch (err) {
//     console.error('Error en getProductos:', err);
//     res.status(500).json({
//       success: false,
//       message: 'No se pudieron obtener los productos'
//     });
//   }
// };

// //===== Obtener un producto por ID =====
// export const getProductoById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const producto = await Producto.findByPk(id, {
//       include: [{
//         model: Categoria,
//         as: 'categoria',
//         attributes: ['id', 'nombre', 'descripcion']
//       }]
//     });

//     if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

//     res.json({ success: true, data: producto });
//   } catch (err) {
//     console.error('Error en getProducto:', err);
//     res.status(500).json({
//       success: false,
//       message: 'No se pudo obtener el producto'
//     });
//   }
// };


// // ===== Crear un producto =====
// export const createProducto = async (req, res) => {
//   try {
//     const { nombre, descripcion, precio, stock, categoriaId } = req.body;

//     const nuevoProducto = await Producto.create({ nombre, descripcion, precio, stock, categoriaId });

//     // Cargar categoría si existe
//     const productoConCategoria = await Producto.findByPk(nuevoProducto.id, {
//       include: [{
//         model: Categoria,
//         as: 'categoria',
//         attributes: ['id', 'nombre', 'descripcion']
//       }]
//     });

//     res.status(201).json({
//       success: true,
//       data: productoConCategoria || nuevoProducto,
//       message: 'Producto creado exitosamente'
//     });
//   } catch (err) {
//     console.error('Error en createProducto:', err);
//     res.status(500).json({
//       success: false,
//       message: 'No se pudo crear el producto'
//     });
//   }
// };

// // ===== Actualizar un producto =====
// export const updateProducto = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const producto = await Producto.findByPk(id);
//     if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

//     await producto.update(req.body);

//     res.json({
//       success: true,
//       data: producto,
//       message: 'Producto actualizado exitosamente'
//     });
//   } catch (err) {
//     console.error('Error en updateProducto:', err);
//     res.status(500).json({
//       success: false,
//       message: 'No se pudo actualizar el producto'
//     });
//   }
// };

// // // Eliminar un producto
// // export const deleteProducto = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const resultado = await Producto.destroy({ where: { id } });
// //     if (resultado > 0) {
// //       res.status(200).json({ message: 'Producto eliminado correctamente' });
// //     } else {
// //       res.status(404).json({ message: 'Producto no encontrado para eliminar' });
// //     }
// //   } catch (error) {
// //     console.error('Error al eliminar producto:', error);
// //     res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
// //   }
// // };

// // ===== Eliminar un producto (soft delete) =====
// export const deleteProducto = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const producto = await Producto.findByPk(id);
//     if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

//     await producto.update({ activo: false });

//     res.json({ success: true, message: 'Producto eliminado exitosamente' });
//   } catch (err) {
//     console.error('Error en deleteProducto:', err);
//     res.status(500).json({
//       success: false,
//       message: 'No se pudo eliminar el producto'
//     });
//   }
// };



// // Obtener productos relacionados
// export const obtenerProductosRelacionados = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const productoActual = await Producto.findByPk(id);
//     if (!productoActual) {
//       return res.status(404).json({ message: 'Producto no encontrado' });
//     }

//     const productosRelacionados = await Producto.findAll({
//       where: {
//         idCategoria: productoActual.idCategoria,
//         id: { [Op.ne]: id }, // excluye el producto actual
//       },
//       limit: 3,
//       include: [{ model: Categoria, as: "categoria"}],
//     });

//     res.status(200).json(productosRelacionados);
//   } catch (error) {
//     console.error('Error al obtener productos relacionados', error);
//     res.status(500).json({message: 'Error al obtener productos relacionados', error: error.message});
//   }
// };

// //Obtener Resenas por producto
// export const obtenerResenasPorProducto = async (req, res) => {
//   try {
//     const { idProducto } = req.params;
//     const resenas = await Resena.findAll({
//       where: { idProducto },
//       order: [['fechaResena', 'DESC']],
//     });
//     res.status(200).json(resenas);
//   } catch (error) {
//     console.error('Error al obtener reseñas del producto', error);
//     res.status(500).json({ message: 'Error al obtener reseñas del producto', error: error.message });
//   }
// };

// //Crear una nueva Resena
// export const crearResenaPorProducto = async (req, res) => {
//   try {
//     console.log("📩 Body recibido:", req.body);
//     console.log("🛒 Params:", req.params);
//     const { idProducto }= req.params; // aqui obtenemos el idProducto desde la URL con req.params
//     const { calificacion, comentario, idUsuario } = req.body;
//     const nuevaResena = await Resena.create({
//       idProducto, // declaramos el idProducto más allá q lo obtenemos de la URL(req.params) xq estamos creando una reseña nueva y Sequelize necesita saber qué idProducto asociar a esa reseña. Pero este atributo no se incluye en el JSON del body para hacer POST xq ya lo estamos extrayendo de req.params
//       calificacion,
//       comentario,
//       idUsuario,
//     });

//     console.log("✅ Respuesta a enviar:", nuevaResena);
//     res.status(201).json(nuevaResena);
//   } catch (error) {
//     console.log('Error al crear reseña', error);
//     res.status(500).json({ message: 'Error al crear reseña', error: error.message});
//   }
// }

