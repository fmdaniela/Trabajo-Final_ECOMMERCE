import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodoPago: {
    type: DataTypes.ENUM('tarjeta', 'efectivo', 'transferencia'),
    allowNull: false
  },
  estadoPago: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'cancelado'),
    allowNull: false
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false,  //El backend recibe la fecha de pago oficial desde la pasarela (en la respuesta de la API).
  },
  referenciaExterna: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idOrdenCompra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ordenesCompras', 
        key: 'id'
      },
      unique: true // esto asegura la relación 1:1
    }
  }, {
    tableName: 'pagos',
    timestamps: false
  });

export default Pago;

/*
¿Por qué va unique: true?
Cuando definís una relación 1:1, tenés que asegurarte de que ninguna de las dos entidades se repita en el otro lado.

En este caso:
Cada orden debe tener solo un pago asociado.
Cada pago debe pertenecer a una única orden.
Por eso, al poner unique: true en la FK idOrdenCompra (dentro del modelo Pago), Sequelize se asegura de que no haya dos pagos con el mismo idOrdenCompra, cumpliendo así la restricción de uno a uno.
*/

/*
¿Por qué conviene SIN defaultValue: DataTypes.NOW en este caso?
Porque cuando uses una pasarela como Mercado Pago, Stripe o similar:
El backend recibe la fecha de pago oficial desde la pasarela (en la respuesta de la API).
Esa es la fecha que querés guardar, no la fecha en la que se insertó en tu base (que podría ser minutos después de que se procesó el pago).
*/