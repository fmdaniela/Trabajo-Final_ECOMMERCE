import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const DetalleOrden = sequelize.define('DetalleOrden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  idOrdenCompra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ordenesCompras', 
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
  tableName: 'detallesOrden',
  timestamps: true
});

export default DetalleOrden;
