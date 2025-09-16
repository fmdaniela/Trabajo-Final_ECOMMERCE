import Mensaje from '../models/Mensaje.js';

export const obtenerMensajesPorProducto = async (req, res) => {
  const { idProducto } = req.params;
  try {
    const mensajes = await Mensaje.findAll({ where: { idProducto } });
    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

export const crearMensajePorProducto = async (req, res) => {
  const { idProducto } = req.params;
  const { texto } = req.body;
  if (!texto) {
    return res.status(400).json({ error: 'El texto es obligatorio' });
  }
  try {
    const nuevoMensaje = await Mensaje.create({ idProducto, texto });
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res.status(500).json({ error: 'Error al crear mensaje' });
  }
};
