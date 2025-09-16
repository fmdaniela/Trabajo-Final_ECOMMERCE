// import { sequelize } from './src/models/index.js';
// import './src/models/CuponDescuento.js'; 
// import './src/models/Producto.js';
// // ... otros modelos que tengas

async function syncDatabase({ alter = false, force = false } = {}) {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.');
    await sequelize.sync({ alter, force });
    console.log(`🔄 Base de datos sincronizada. (alter: ${alter}, force: ${force})`);
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada.');
  }
}
// Cambiá los parámetros según lo que necesites:
syncDatabase({ alter: true });
// syncDatabase({ force: true });
// syncDatabase(); // Normal

/*
📝 Cómo lo usás
👉 Corrés:


node syncDatabase.js
👉 Esto hace la sincronización y corta (no levanta el servidor).
👉 Cuando ya esté todo ok, corrés normalmente:


node index.js
y no se altera nada.

🎁 Ventajas
✅ No tocás el index.js para cambiar entre force, alter.
✅ Evitás reiniciar el servidor solo para sincronizar.
✅ Tenés un flujo más seguro.
*/

