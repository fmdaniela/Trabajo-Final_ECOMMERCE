import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const MovimientoStock = sequelize.define('MovimientoStock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaMovimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // para que tome fecha/hora actual automáticamente
  },
  tipoMovimiento: {
    type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING(45),
    allowNull: true //para que sea opcional.
  },
  idVarianteProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'variantesProductos', 
      key: 'id'
    }
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  idOrdenCompra: {
    type: DataTypes.INTEGER,
    allowNull: true, // porque no siempre un movimiento de stock estará asociado a una orden de compra por ej, ajustes manuales).
    references: {
      model: 'ordenesCompras',
      key: 'id'
    }
  }
}, {
  tableName: 'movimientosStock',
  timestamps: false
});

export default MovimientoStock;
