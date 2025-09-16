import Categoria from '../models/Categoria.js';
import Producto from '../models/Producto.js';

async function seedDatabase() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear categorías de ejemplo
  const categorias = await Categoria.bulkCreate([
    { nombre: 'Indumentaria', imagenUrl: 'https://via.placeholder.com/150', activo: true },
    { nombre: 'Accesorios', imagenUrl: 'https://via.placeholder.com/150', activo: true },
    { nombre: 'Calzado', imagenUrl: 'https://via.placeholder.com/150', activo: false },
  ]);

  // Crear productos de ejemplo
  await Producto.bulkCreate([
    {
      nombre: 'Camiseta deportiva',
      descripcion: 'Camiseta transpirable para entrenamiento.',
      actividadDeportiva: 'Fútbol',
      idCategoria: categorias[0].id,
      idAdministrador: 1 // suponemos que ya existe el admin 1
    },
    {
      nombre: 'Muñequeras',
      descripcion: 'Muñequeras de algodón.',
      actividadDeportiva: 'Tenis',
      idCategoria: categorias[1].id,
      idAdministrador: 1
    }
  ]);

  console.log('✅ Seed de la base de datos completado.');
}

export default seedDatabase;

/*👉 Cómo usarlo (manual):

En tu index.js podrías poner algo así solo cuando quieras poblar:

import seedDatabase from './src/database/seed.js';

// luego del sync
await sequelize.sync({ force: true }); // ⚠ cuidado: borra todo y recrea las tablas
await seedDatabase();

💡 Lo mejor es NO dejarlo corriendo siempre. Hacelo a mano cuando vos decidas.
*/