import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const CuponDescuento = sequelize.define('CuponDescuento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreCupon: { //Un nombre descriptivo para el cupón (ej. "Descuento Bienvenida","Oferta Verano").
    type: DataTypes.STRING, 
    allowNull: false,
  },
  codigoCupon: { // El código que el usuario ingresará (ej. "BIENVENIDO10","VERANO2024").
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  porcentajeDescuento: { //El porcentaje de descuento a aplicar (ej. 10 para 10%, 25 para 25%). Validación (recomendada): debe ser un valor entre 0 y 100.
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  activo: { //Descripción: Indica si el cupón puede ser utilizado
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'cuponesdescuentos',
  timestamps: false
});

export default CuponDescuento;