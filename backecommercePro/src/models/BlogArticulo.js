import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const BlogArticulo = sequelize.define('BlogArticulo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW  //Sequelize asigna automáticamente la fecha y hora actual al crear un nuevo artículo
  },                             //Si necesitó poner una fecha específica (ej, programar una publicación futura), igual puedo enviarla desde el frontend y Sequelize la usará.         
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  imagenUrl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  categoriablog: {
    type: DataTypes.ENUM('fitness', 'nutricion', 'bienestar', 'general'),
    allowNull: false
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
  tableName: 'blogarticulos',
  timestamps: false
});

export default BlogArticulo;
