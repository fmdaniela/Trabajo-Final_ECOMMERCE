function CategoriaCard({ categoria, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
      onClick={() => onClick(categoria.id)}
    >
      <img
        src={categoria.imagenUrl}
        alt={categoria.nombre}
        className="w-full h-53 object-cover"
      />
      <h3 className="p-4 font-medium text-lg">{categoria.nombre}</h3>
    </div>
  );
};

export default CategoriaCard;
