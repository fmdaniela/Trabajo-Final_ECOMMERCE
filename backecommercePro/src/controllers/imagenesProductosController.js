import ImagenProducto from '../models/ImagenProducto.js';
import Producto from '../models/Producto.js'

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