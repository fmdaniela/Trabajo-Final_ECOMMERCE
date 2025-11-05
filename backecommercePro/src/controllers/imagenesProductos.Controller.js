import ImagenProducto from '../models/ImagenProducto.js';
import Producto from '../models/Producto.js'
import fs from 'fs/promises';
import path from 'path';

// ==================================================
// 📌 BLOQUE PÚBLICO (TIENDA ECOMMERCE)
// ==================================================

// Obtener todas las imágenes de un producto
export const obtenerImagenesPorProducto = async (req, res) => {
    try {
       const { idProducto } = req.params;
       
       const producto = await Producto.findByPk(idProducto);
       if(!producto) {
        return res.status(404).json({message: 'Producto no encontrado'});
       }

       const imagenes = await ImagenProducto.findAll({
        where: { idProducto }
       });

       res.status(200).json(imagenes);
    } catch (error) {
      console.error('Error al obtenet imágenes:', error);
      res.status(500).json({message: 'Error al obtener imágenes', error: error.message});
    }
};


// Agregar una nueva imagen al producto
export const agregarImagenPorProducto = async (req, res) => {
    try {
      const { idProducto } = req.params; //esto indica q idProducto se va a recibir desde los parámetros de la URL. Ejemplo: POST  http:localhost:300/api/productos/1/imagenes. Acá 1 es el valor del idProducto
      const { urlImagen } = req.body; //esto indica que en el body del POST debe venir un campo llamado urlImagen
         
      const producto = await Producto.findByPk(idProducto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      const nuevaImagen = await ImagenProducto.create({
        idProducto,
        urlImagen
      });
        
      res.status(201).json(nuevaImagen);
    } catch (error) {
      console.error('Error al agregar imagen:', error);
      res.status(500).json({message: 'Error al agregar imagen', error: error.message});
    }
}; 

// ==================================================
// 📌 BLOQUE PRIVADO (PANEL ADMIN)
// ==================================================

// Eliminar una imagen de producto
export const eliminarImagen = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar imagen secundaria en la DB
    const imagen = await ImagenProducto.findByPk(id);
    if (!imagen) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Eliminar registro de la DB primero
    await imagen.destroy();

    // Luego intentar eliminar archivo físico (si es local y no URL externa)
    if (imagen.urlImagen && !imagen.urlImagen.startsWith('http')) {
      const filePath = path.join(process.cwd(), imagen.urlImagen);
      fs.unlink(filePath).catch(err => {
        console.warn('No se pudo borrar el archivo físico:', err.message);
      });
    }

    if (imagen.thumbnailUrl && !imagen.thumbnailUrl.startsWith('http')) {
      const thumbPath = path.join(process.cwd(), imagen.thumbnailUrl);
      fs.unlink(thumbPath).catch(err => {
        console.warn('No se pudo borrar la miniatura:', err.message);
      });
    }

    res.json({ message: 'Imagen secundaria eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar imagen secundaria:', error);
    res.status(500).json({ message: 'Error al eliminar imagen', error: error.message });
  }
};

