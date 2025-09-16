import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Carrito = sequelize.define('Carrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'carritos',
  timestamps: true, // Sequelize agrega createdAt y updatedAt automáticamente
  createdAt: 'fechaCreacion', //personalizamos el nombre de las columnas
  updatedAt: 'fechaModificacion',
});

export default Carrito;


/*
¿Qué hace Sequelize con timestamps: true?
Crea dos columnas automáticamente en la tabla:
createdAt → fecha/hora en que se creó el registro.
updatedAt → fecha/hora en que se actualizó por última vez.
Cuando usás métodos como create(), update() o save(), Sequelize actualiza esas fechas automáticamente por vos.
*/
