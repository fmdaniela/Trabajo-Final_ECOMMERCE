import productos from '../data/productos';
import ProductCard from './ProductCard';

function ProductList() {
  return (
    <section className="py-10 px-4 max-w-screen-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-semibold mb-4 text-pink-600">DESTACADOS</h2>
        <p className="text-gray-600">Los favoritos de nuestra comunidad</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
