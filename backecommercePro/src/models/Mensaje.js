import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Mensaje = sequelize.define('Mensaje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'mensajes',
  timestamps: true,  
});

export default Mensaje;
