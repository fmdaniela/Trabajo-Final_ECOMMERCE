import Etiqueta from '../models/Etiqueta.js';
import Producto from '../models/Producto.js';


// Obtener todas las etiquetas de un producto
export const obtenerEtiquetasPorProducto = async (req, res) => {
    try {
       const { idProducto } = req.params;
       
       const producto = await Producto.findByPk(idProducto);
       if(!producto) {
        return res.status(404).json({message: 'Producto no encontrado'});
       }

       const etiquetas = await Etiqueta.findAll({
        where: { idProducto }
       });

       res.status(200).json(etiquetas);
    } catch (error) {
      console.error('Error al obtener etiquetas:', error);
      res.status(500).json({message: 'Error al obtener etiquetas', error: error.message});
    }
};


// Agregar una nueva etiqueta al producto
export const crearEtiquetaPorProducto = async (req, res) => {
    try {
      const { idProducto } = req.params; 
      const { texto } = req.body; 
         
      const producto = await Producto.findByPk(idProducto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      if (!texto || texto.trim() === '') {
      return res.status(400).json({ message: 'El campo "texto" es obligatorio' });
      }
        
      const nuevaEtiqueta = await Etiqueta.create({
        idProducto,
        texto
      });
        res.status(201).json(nuevaEtiqueta);
    } catch (error) {
      console.error('Error al crear etiqueta:', error);
      res.status(500).json({message: 'Error al crear etiqueta', error: error.message});
    }
};  