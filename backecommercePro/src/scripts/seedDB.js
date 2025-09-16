import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from '../db/connection.js';
import Rol from '../models/Rol.js';
import Usuario from '../models/Usuario.js';
import Administrador from '../models/Administrador.js';

const SALT_ROUNDS = 10;

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    await sequelize.authenticate();
    console.log('✅ Conexión a la DB establecida');

    // Sincronizar modelos (no borra tablas existentes)
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados');

    // ===== Crear roles por defecto =====
    const rolesData = [
      { codigo: 'SUPERADMIN', descripcion: 'Super Administrador' },
      { codigo: 'ADMIN', descripcion: 'Administrador del sistema' },
      { codigo: 'USER', descripcion: 'Usuario estándar' },
      { codigo: 'GUEST', descripcion: 'Usuario invitado' } 
    ];

    for (const rolData of rolesData) {
      const [rol, created] = await Rol.findOrCreate({
        where: { codigo: rolData.codigo },
        defaults: rolData
      });
      console.log(created ? `✅ Rol creado: ${rol.codigo}` : `ℹ️  Rol ya existe: ${rol.codigo}`);
    }

    const adminRol = await Rol.findOne({ where: { codigo: 'ADMIN' } });
    const userRol = await Rol.findOne({ where: { codigo: 'USER' } });

    // ===== Crear administrador de prueba =====
    const adminData = {
      nombre: 'Administrador',
      apellido: 'Principal',
      email: 'admin@universidad.edu',
      password: await bcrypt.hash('admin123', SALT_ROUNDS),
      idRol: adminRol.id
    };

    const [admin, adminCreated] = await Administrador.findOrCreate({
      where: { email: adminData.email },
      defaults: adminData
    });
    console.log(adminCreated ? `✅ Administrador creado: ${admin.nombre}` : `ℹ️ Administrador ya existe: ${admin.nombre}`);

    // ===== Crear usuarios de prueba =====
    const usuariosData = [
      { nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@universidad.edu', password: await bcrypt.hash('user123', SALT_ROUNDS), idRol: userRol.id },
      { nombre: 'María', apellido: 'García', email: 'maria.garcia@universidad.edu', password: await bcrypt.hash('user123', SALT_ROUNDS), idRol: userRol.id }
    ];

    for (const usuarioData of usuariosData) {
      const [usuario, created] = await Usuario.findOrCreate({
        where: { email: usuarioData.email },
        defaults: usuarioData
      });
      console.log(created ? `✅ Usuario creado: ${usuario.nombre}` : `ℹ️ Usuario ya existe: ${usuario.nombre}`);
    }

    console.log('🎉 Seed completado exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
};

seedDatabase();
