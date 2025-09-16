import Pais from '../models/Pais.js';
import { Op } from 'sequelize';

// Obtener todos los países activos
export const getPaises = async (req, res) => {
  try {
    const paises = await Pais.findAll({
      where: { 
        activo: true }
    });

    if (paises.length === 0) {
      return res.status(404).json({ message: 'No hay países activos disponibles' });
    }

    res.status(200).json(paises);
  } catch (error) {
    console.error("Error al obtener países:", error);
    res.status(500).json({ message: 'Error al obtener países', error: error.message });
  }
};

// Obtener un pais por id
export const getPaisById = async (req, res) => {
  try {
    const { id } = req.params;
    const pais = await Pais.findByPk(id);
    if (pais) {
      res.status(200).json(pais);
    } else {
      res.status(404).json({ message: 'Pais no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener pais por id:", error);
    res.status(500).json({ message: 'Error al obtener pais', error: error.message });
  }
};

//Buscar país por nombre parcial
export const buscarPaisPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    const paises = await Pais.findAll({
      where: {
        activo: true,
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      }
    });

    res.status(200).json(paises);
  } catch (error) {
    console.error("Error al buscar país:", error);
    res.status(500).json({ message: 'Error al buscar país', error: error.message });
  }
};

// Crear un nuevo pais
export const createPais = async (req, res) => {
  try {
    const nuevoPais = await Pais.create(req.body);
    res.status(201).json(nuevoPais);
  } catch (error) {
    console.error("Error al crear pais:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error al crear pais', error: error.message });
  }
};

// Actualizar un pais existente
export const updatePais = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    const pais = await Pais.findByPk(id);

    if (pais) {
      const paisActualizado = await pais.update(datosActualizar);
      res.status(200).json(paisActualizado);
    } else {
      res.status(404).json({ message: 'Pais no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar pais:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar un pais
export const deletePais = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Pais.destroy({ where: { id } });
    if (resultado > 0) {
      res.status(200).json({ message: 'Pais eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Pais no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar pais:", error);
    res.status(500).json({ message: 'Error al eliminar pais', error: error.message });
  }
};

