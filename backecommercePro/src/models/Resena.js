import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Resena = sequelize.define('Resena', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { // se limita la calificacion para que esté en un rango válido (1 a 5)
      min: 1,
      max: 5
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fechaResena: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // significa que Sequelize puede asignar la fecha automáticamente si uno no la manda.
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id'
    }
  }
}, {
  tableName: 'resenas',
  timestamps: false
});

export default Resena;
