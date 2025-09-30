import Carrito from '../models/Carrito.js';
import DetalleCarrito from '../models/DetalleCarrito.js';
import Producto from '../models/Producto.js';
import OrdenCompra from '../models/OrdenCompra.js';
import DetalleOrden from '../models/DetalleOrden.js';
import Pago from '../models/Pago.js';

// Obtener carrito activo del usuario
export const getCarritoActivo = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // asumimos middleware auth
    let carrito = await Carrito.findOne({
      where: { idUsuario: usuarioId, activo: true },
      include: [
        {
          model: DetalleCarrito,
          as: 'items',
          include: [Producto]
        }
      ]
    });

    if (!carrito) {
      carrito = await Carrito.create({ idUsuario: usuarioId });
    }

    res.status(200).json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
};

// Agregar producto al carrito
export const agregarProducto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) return res.status(400).json({ message: 'Faltan datos' });

    // Obtener carrito activo
    let carrito = await Carrito.findOne({ where: { idUsuario: usuarioId, activo: true } });
    if (!carrito) carrito = await Carrito.create({ idUsuario: usuarioId });

    // Ver si el producto ya está en el carrito
    let detalle = await DetalleCarrito.findOne({
      where: { idCarrito: carrito.id, idProducto: productoId }
    });

    if (detalle) {
      // Sumar cantidad
      detalle.cantidad += cantidad;
      await detalle.save();
    } else {
      // Crear nuevo detalle
      const producto = await Producto.findByPk(productoId);
      if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

      detalle = await DetalleCarrito.create({
        idCarrito: carrito.id,
        idProducto: productoId,
        cantidad,
        precioUnitario: producto.precio
      });
    }

    const carritoActualizado = await Carrito.findByPk(carrito.id, {
      include: [
        { model: DetalleCarrito, as: 'items', include: [Producto] }
      ]
    });

    res.status(200).json(carritoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar producto', error: error.message });
  }
};


// Actualizar cantidad de un producto en el carrito
export const actualizarProducto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productoId } = req.params;
    const { cantidad } = req.body;

    const carrito = await Carrito.findOne({ where: { idUsuario: usuarioId, activo: true } });
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    const detalle = await DetalleCarrito.findOne({
      where: { idCarrito: carrito.id, idProducto: productoId }
    });
    if (!detalle) return res.status(404).json({ message: 'Producto no encontrado en carrito' });

    detalle.cantidad = cantidad;
    await detalle.save();

    const carritoActualizado = await Carrito.findByPk(carrito.id, {
      include: [
        { model: DetalleCarrito, as: 'items', include: [Producto] }
      ]
    });

    res.status(200).json(carritoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar producto del carrito
export const eliminarProducto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productoId } = req.params;

    const carrito = await Carrito.findOne({ where: { idUsuario: usuarioId, activo: true } });
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    const resultado = await DetalleCarrito.destroy({
      where: { idCarrito: carrito.id, idProducto: productoId }
    });

    if (resultado === 0) return res.status(404).json({ message: 'Producto no encontrado en carrito' });

    const carritoActualizado = await Carrito.findByPk(carrito.id, {
      include: [
        { model: DetalleCarrito, as: 'items', include: [Producto] }
      ]
    });

    res.status(200).json(carritoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

// Finalizar carrito → crear OrdenCompra y DetalleOrden
export const finalizarCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { idDireccion } = req.body; // dirección de envío

    const carrito = await Carrito.findOne({
      where: { idUsuario: usuarioId, activo: true },
      include: [{ model: DetalleCarrito, as: 'items', include: [Producto] }]
    });

    if (!carrito || carrito.items.length === 0)
      return res.status(400).json({ message: 'Carrito vacío o no encontrado' });

    // Calcular totales
    const subtotal = carrito.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
    const total = subtotal; // si querés agregar descuentos después, aplicalos aquí

    // Crear orden
    const orden = await OrdenCompra.create({
      numeroOrden: `ORD-${Date.now()}`,
      fechaOrden: new Date(),
      subtotal,
      descuento: 0,
      total,
      estado: 'pendiente',
      idUsuario: usuarioId,
      idDireccion,
      idCarrito: carrito.id
    });

    // Crear detalle de orden
    const detallesOrden = carrito.items.map(item => ({
      idOrdenCompra: orden.id,
      idProducto: item.idProducto,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.cantidad * item.precioUnitario
    }));

    await DetalleOrden.bulkCreate(detallesOrden);

    // Crear pago vacío (pendiente)
    await Pago.create({ idOrdenCompra: orden.id, monto: total, estado: 'pendiente' });
    
    // Marcar carrito como finalizado
    carrito.activo = false;
    await carrito.save();

    res.status(200).json({ ordenId: orden.id, message: 'Compra finalizada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al finalizar carrito', error: error.message });
  }
};
