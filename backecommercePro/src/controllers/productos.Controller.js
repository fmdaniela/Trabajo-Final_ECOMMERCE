import { Producto, Categoria, Resena, ImagenProducto  } from '../models/index.js';
import { Op } from "sequelize";
import fs from "fs/promises"; 
import path from "path";
import sharp from 'sharp';


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
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        { model: ImagenProducto, as: "imagenes" } // traemos todas las imágenes secundarias
      ],
    });

    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto (admin):", error);
    res.status(500).json({ error: "Error al obtener producto (admin)" });
  }
};


// ======================
// CREAR PRODUCTO
// ======================
export const createProducto = async (req, res) => {
  try {
    const datosProducto = req.body;

    // 🟡 Convertir 'destacado' a boolean si viene del formulario
    if (datosProducto.destacado !== undefined) {
      datosProducto.destacado =
        datosProducto.destacado === "true" || datosProducto.destacado === true;
    }

    // 🔸 Directorio para miniaturas
    const thumbsDir = path.join("uploads", "productos", "thumbs");
    try {
      await fs.access(thumbsDir);
    } catch {
      await fs.mkdir(thumbsDir, { recursive: true });
    }

    // 🟩 Si se subieron imágenes
    if (req.files && req.files.length > 0) {
      // Usamos la primera como imagen principal
      const filePrincipal = req.files[0];
      const thumbPathPrincipal = path.join(thumbsDir, filePrincipal.filename);

      await sharp(filePrincipal.path).resize(200).toFile(thumbPathPrincipal);

      datosProducto.imagenUrl = `/uploads/productos/${filePrincipal.filename}`;
      datosProducto.thumbnailUrl = `/uploads/productos/thumbs/${filePrincipal.filename}`;
    }

    // 🟩 Valores por defecto
    if (!datosProducto.actividadDeportiva)
      datosProducto.actividadDeportiva = "General";
    if (!datosProducto.idAdministrador) datosProducto.idAdministrador = 1;

    // 🟩 Crear producto
    const nuevoProducto = await Producto.create(datosProducto);

    // 🟩 Procesar imágenes adicionales (si hay más de una)
    if (req.files && req.files.length > 1) {
      const imagenesExtras = req.files.slice(1); // todas menos la primera

      for (const file of imagenesExtras) {
        const thumbPath = path.join(thumbsDir, file.filename);
        await sharp(file.path).resize(200).toFile(thumbPath);

        await ImagenProducto.create({
          idProducto: nuevoProducto.id,
          urlImagen: `/uploads/productos/${file.filename}`,
          thumbnailUrl: `/uploads/productos/thumbs/${file.filename}`,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "✅ Producto creado correctamente",
      data: nuevoProducto,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al crear producto" });
  }
};



// ======================
// ACTUALIZAR PRODUCTO
// ======================
export const updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [{ model: ImagenProducto, as: "imagenes" }],
    });

    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    const nuevosDatos = req.body;

    // 🟡 Convertir destacado a boolean
    if (nuevosDatos.destacado !== undefined) {
      nuevosDatos.destacado =
        nuevosDatos.destacado === "true" || nuevosDatos.destacado === true;
    }

    // 🔸 Directorio para miniaturas
    const thumbsDir = path.join("uploads", "productos", "thumbs");
    try {
      await fs.access(thumbsDir);
    } catch {
      await fs.mkdir(thumbsDir, { recursive: true });
    }

    // 🟩 Si llegan nuevas imágenes
    if (req.files && req.files.length > 0) {
      // 1️⃣ Reemplazar imagen principal (primera)
      const filePrincipal = req.files[0];
      const thumbPathPrincipal = path.join(thumbsDir, filePrincipal.filename);
      await sharp(filePrincipal.path).resize(200).toFile(thumbPathPrincipal);

      // Eliminar imagen principal anterior
      if (producto.imagenUrl) {
        try { await fs.unlink(path.join(".", producto.imagenUrl)); } catch {}
      }
      if (producto.thumbnailUrl) {
        try { await fs.unlink(path.join(".", producto.thumbnailUrl)); } catch {}
      }

      nuevosDatos.imagenUrl = `/uploads/productos/${filePrincipal.filename}`;
      nuevosDatos.thumbnailUrl = `/uploads/productos/thumbs/${filePrincipal.filename}`;

      // 2️⃣ Imágenes secundarias (si hay más de 1 archivo)
      if (req.files.length > 1) {
        const imagenesExtras = req.files.slice(1);

        // 🔹 Eliminar imágenes secundarias anteriores de DB y disco
        if (producto.imagenes && producto.imagenes.length > 0) {
          for (const img of producto.imagenes) {
            try { await fs.unlink(path.join(".", img.urlImagen)); } catch {}
            try { await fs.unlink(path.join(".", img.thumbnailUrl)); } catch {}
          }
          await ImagenProducto.destroy({ where: { idProducto: producto.id } });
        }

        // 🔹 Crear nuevas imágenes secundarias
        for (const file of imagenesExtras) {
          const thumbPath = path.join(thumbsDir, file.filename);
          await sharp(file.path).resize(200).toFile(thumbPath);

          await ImagenProducto.create({
            idProducto: producto.id,
            urlImagen: `/uploads/productos/${file.filename}`,
            thumbnailUrl: `/uploads/productos/thumbs/${file.filename}`,
          });
        }
      }
    }

    // 🔹 Actualizar datos del producto
    await producto.update(nuevosDatos);

    res.json({
      success: true,
      message: "✅ Producto actualizado correctamente",
      data: producto,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar producto" });
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

// // PATCH → alternar activo/inactivo
// export const toggleProductoActivo = async (req, res) => {
//   try {
//     const producto = await Producto.findByPk(req.params.id);
//     if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

//     await producto.update({ activo: !producto.activo });
//     res.json({ message: "Estado del producto actualizado", producto });
//   } catch (error) {
//     console.error("Error al cambiar estado del producto:", error);
//     res.status(500).json({ error: "Error al cambiar estado del producto" });
//   }
// };


// ==================================================
// 📌 BLOQUE PÚBLICO (TIENDA ECOMMERCE)
// ==================================================

// GET productos activos con filtros + paginación
export const getProductos = async (req, res) => {
  try {
    // 🔹 Query params desde el frontend
    const {
      page = 1,
      limit = 12,
      categoria,
      busqueda,
      orden
    } = req.query;

    const offset = (page - 1) * limit;

    // 🔹 Filtro base (solo productos activos)
    const whereClause = { activo: true };

    // 🔹 Filtrar por categoría (nombre, no id)
    if (categoria) {
      const categoriaEncontrada = await Categoria.findOne({
        where: { nombre: { [Op.like]: categoria } }
      });
      if (categoriaEncontrada) {
        whereClause.idCategoria = categoriaEncontrada.id;
      } else {
        // si la categoría no existe, devolvemos vacío
        return res.json({
          productos: [],
          pagination: { currentPage: 1, totalPages: 0, totalItems: 0 }
        });
      }
    }

    // 🔹 Filtro por búsqueda (nombre del producto)
    if (busqueda) {
      whereClause.nombre = { [Op.like]: `%${busqueda}%` };
    }

    // 🔹 Ordenar resultados
    let order = [];
    if (orden === "menor_precio") order = [["precio", "ASC"]];
    else if (orden === "mayor_precio") order = [["precio", "DESC"]];
    else order = [["fechaCreacion", "DESC"]]; // por defecto

    // 🔹 Consultar productos con paginación
    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });

    // 🔹 Respuesta con datos y paginación
    res.json({
      productos: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};


// //GET productos activos
// export const getProductos = async (req, res) => {
//   try {
//     const productos = await Producto.findAll({ where: { activo: true } });
//     res.json(productos);
//   } catch (error) {
//     console.error("Error al obtener productos:", error);
//     res.status(500).json({ error: "Error al obtener productos" });
//   }
// };

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


// GET productos destacados (solo activos)
export const getProductosDestacados = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true, destacado: true },
      order: [['fechaCreacion', 'DESC']],
      limit: 10, // opcional: podés ajustar el límite de productos a mostrar
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    res.status(500).json({ error: "Error al obtener productos destacados" });
  }
};














