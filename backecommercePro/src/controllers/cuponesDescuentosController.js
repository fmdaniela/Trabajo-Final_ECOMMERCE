import CuponDescuento from '../models/CuponDescuento.js';

// Obtener todos los cupones de descuento
export const getCuponesDescuento = async (req, res) => {
  try {
    const cupones = await CuponDescuento.findAll();
    res.status(200).json(cupones);
  } catch (error) {
    console.error("Error al obtener cupones de descuento:", error);
    res.status(500).json({ message: 'Error al obtener cupones de descuento', error: error.message });
  }
};

// Obtener un cupón por id
export const getCuponDescuentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const cupon = await CuponDescuento.findByPk(id);
    if (cupon) {
      res.status(200).json(cupon);
    } else {
      res.status(404).json({ message: 'Cupón no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener cupón por id:", error);
    res.status(500).json({ message: 'Error al obtener cupón', error: error.message });
  }
};

// Crear un nuevo cupón
export const createCuponDescuento = async (req, res) => {
  try {
    const nuevoCupon = await CuponDescuento.create(req.body);
    res.status(201).json(nuevoCupon);
  } catch (error) {
    console.error("Error al crear cupón:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error al crear cupón', error: error.message });
  }
};

// Actualizar un cupón existente
export const updateCuponDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const cupon = await CuponDescuento.findByPk(id);

    if (cupon) {
      const cuponActualizado = await cupon.update(datosActualizar);
      res.status(200).json(cuponActualizado);
    } else {
      res.status(404).json({ message: 'Cupón no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar cupón:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un cupón
export const deleteCuponDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await CuponDescuento.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Cupón eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Cupón no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar cupón:", error);
    res.status(500).json({ message: 'Error al eliminar cupón', error: error.message });
  }
};

// Validar un cupón por código (GET)
export const validarCuponGet = async (req, res) => {
  try {
    const { codigoCupon } = req.params;
    const cupon = await CuponDescuento.findOne({
      where: {
        codigoCupon,
        activo: true
      }
    });

    if (!cupon) {
      return res.status(404).json({ message: 'El código de cupón ingresado no es válido o ha expirado.' });
    }

    res.status(200).json(cupon);
  } catch (error) {
    console.error("Error al validar cupón (GET):", error);
    res.status(500).json({ message: 'Error al validar el cupón', error: error.message });
  }
};

// Validar un cupón por código (POST)
export const validarCuponPost = async (req, res) => {
  try {
    const { codigoCupon } = req.body;

    if (!codigoCupon) {
      return res.status(400).json({ message: 'Debes enviar un código de cupón en el body.' });
    }

    const cupon = await CuponDescuento.findOne({
      where: {
        codigoCupon,
        activo: true
      }
    });

    if (!cupon) {
      return res.status(404).json({ message: 'El código de cupón ingresado no es válido o ha expirado.' });
    }

    res.status(200).json(cupon);
  } catch (error) {
    console.error("Error al validar cupón (POST):", error);
    res.status(500).json({ message: 'Error al validar el cupón', error: error.message });
  }
};
