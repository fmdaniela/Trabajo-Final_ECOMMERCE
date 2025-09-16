import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Etiqueta = sequelize.define('Etiqueta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  texto: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: 'etiquetas',
  timestamps: false
});

export default Etiqueta;
