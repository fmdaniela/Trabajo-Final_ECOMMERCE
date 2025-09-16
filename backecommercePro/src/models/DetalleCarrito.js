import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const DetalleCarrito = sequelize.define('DetalleCarrito', {
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
  idCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'carritos', 
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
  tableName: 'detallesCarritos',
  timestamps: true
});

export default DetalleCarrito;




