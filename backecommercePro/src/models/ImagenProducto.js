import { DataTypes } from "sequelize";
import sequelize from '../db/connection.js';

const ImagenProducto = sequelize.define('ImagenProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  urlImagen: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  tableName: 'ImagenesProductos',
  timestamps: true,  // Sequelize se encarga de createdAt y updatedAt
});

export default ImagenProducto;