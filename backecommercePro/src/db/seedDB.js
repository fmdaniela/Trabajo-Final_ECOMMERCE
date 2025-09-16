require('dotenv').config();
const { sequelize, RolModel, UsuarioModel, ProductoModel } = require("../models/index.model");

const seedDatabase = async () => {
    try {
        console.log("🌱 Iniciando seed de la base de datos...");
        
        await sequelize.authenticate();
        console.log("✅ Conexión a DB establecida");
        
        // Sincronizar modelos primero
        await sequelize.sync({ force: false });
        console.log("✅ Modelos sincronizados");
        
        // Crear roles por defecto
        const rolesData = [
            { codigo: 'ADMIN', descripcion: 'Administrador del sistema' },
            { codigo: 'USER', descripcion: 'Usuario estándar' },
            { codigo: 'GUEST', descripcion: 'Usuario invitado' }
        ];
        
        for (const rolData of rolesData) {  
            const [rol, created] = await RolModel.findOrCreate({
                where: { codigo: rolData.codigo },
                defaults: rolData
            });
            if (created) {
                console.log(`✅ Rol creado: ${rol.codigo}`);
            } else {
                console.log(`ℹ️  Rol ya existe: ${rol.codigo}`);
            }
        }
        
        // Crear usuarios de ejemplo
        const adminRol = await RolModel.findOne({ where: { codigo: 'ADMIN' } });
        const userRol = await RolModel.findOne({ where: { codigo: 'USER' } });
        
        const usuariosData = [
            { nombre: 'Administrador', email: 'admin@universidad.edu', rolId: adminRol.id, password: '123456' },
            { nombre: 'Juan Pérez', email: 'juan.perez@universidad.edu', rolId: userRol.id, password: '123456' },
            { nombre: 'María García', email: 'maria.garcia@universidad.edu', rolId: userRol.id, password: '123456' }
        ];
        
        for (const usuarioData of usuariosData) {
            const [usuario, created] = await UsuarioModel.findOrCreate({
                where: { email: usuarioData.email },
                defaults: usuarioData
            });
            if (created) {
                console.log(`✅ Usuario creado: ${usuario.nombre}`);
            } else {
                console.log(`ℹ️  Usuario ya existe: ${usuario.nombre}`);
            }
        }
        
        // Crear productos de ejemplo
        const productosData = [
            {
                nombre: 'Laptop Dell XPS 13',
                descripcion: 'Laptop ultrabook con procesador Intel i7',
                precio: 1299.99,
                stock: 5,
                categoria: 'Electrónicos'
            },
            {
                nombre: 'Mouse Logitech MX Master 3',
                descripcion: 'Mouse ergonómico inalámbrico',
                precio: 89.99,
                stock: 15,
                categoria: 'Accesorios'
            },
            {
                nombre: 'Teclado Mecánico RGB',
                descripcion: 'Teclado mecánico con iluminación RGB',
                precio: 159.99,
                stock: 8,
                categoria: 'Accesorios'
            },
            {
                nombre: 'Monitor 4K 27"',
                descripcion: 'Monitor 4K UHD de 27 pulgadas',
                precio: 399.99,
                stock: 3,
                categoria: 'Monitores'
            }
        ];
        
        for (const productoData of productosData) {
            const [producto, created] = await ProductoModel.findOrCreate({
                where: { nombre: productoData.nombre },
                defaults: productoData
            });
            if (created) {
                console.log(`✅ Producto creado: ${producto.nombre}`);
            } else {
                console.log(`ℹ️  Producto ya existe: ${producto.nombre}`);
            }
        }
        
        console.log("🎉 Seed completado exitosamente");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error durante el seed:", error);
        process.exit(1);
    }
};

seedDatabase();
