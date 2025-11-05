import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import bcrypt from 'bcryptjs';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true //  CAMBIADO A true PARA AUTH SOCIAL. (porque algunos entran con Google).
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  idRol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  // NUEVOS CAMPOS PARA GOOGLE
  proveedor: { 
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local'
  },
  proveedorId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion',

  //hooks son funciones que Sequelize ejecuta automáticamente
  hooks: {
    beforeCreate: async (usuario) => {
      // ✅ Solo hashear si es usuario LOCAL
      if (usuario.password && usuario.proveedor === 'local') {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      // ✅ Solo hashear si es LOCAL y cambió password
      if (usuario.changed('password') && usuario.proveedor === 'local') {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    } //Esto evita olvidarse de hacer el bcrypt en cada controlador. El modelo ya se ocupa.
  }
});

// Método para comparar contraseñas (solo para usuarios locales)
Usuario.prototype.validPassword = async function(password) {
  if (!this.password || this.proveedor !== 'local') return false;
  return await bcrypt.compare(password, this.password);
};

export default Usuario;

//El método validarPassword del modelo encapsula el bcrypt.compare, evita hacerlo en cada controlador

//bcrypt.compare toma el hash y ve si coincide con el password plano.