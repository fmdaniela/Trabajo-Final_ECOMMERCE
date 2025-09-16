import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const VarianteProducto = sequelize.define('VarianteProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  talla: {
    type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL'),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false 
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  tableName: 'variantesProductos',
  timestamps: false
});

export default VarianteProducto;
