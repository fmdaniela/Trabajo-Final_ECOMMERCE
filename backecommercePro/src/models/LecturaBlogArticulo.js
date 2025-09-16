import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const LecturaBlogArticulo = sequelize.define('LecturaBlogArticulo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaLectura: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // cuando se crea el registro, automáticamente se guarda la fecha y hora en que se registró la lectura.
  },
  tiempoLectura: {
    type: DataTypes.INTEGER, // en segundos o minutos, según definas en el frontend. Veo si lo implemento
    allowNull: true  // Va true ya que lo definí como opcional puede ir o no.
  },
  completo: {
    type: DataTypes.BOOLEAN,
    allowNull: true  //  Va true ya que lo definí como opcional puede ir o no.
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  idBlog: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'blogarticulos',
      key: 'id'
    }
  }
}, {
  tableName: 'lecturablogarticulos',
  timestamps: false
});

export default LecturaBlogArticulo;
