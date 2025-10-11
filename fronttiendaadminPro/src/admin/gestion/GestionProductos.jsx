import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Search, Filter, Package, RotateCw, BoxIcon } from 'lucide-react';
import moment from 'moment';
import productosService from '../../services/productosService';
import categoriaService from '../../services/categoriaService';

import * as toast from '../../utils/toast';

import ConfirmationDialog from '../../components/ConfirmationDialog';
import Modal from '../../components/Modal';
import Pagination from '../../components/Paginacion';
import RenderSkeletonRows from '../../components/RenderSkeletonRows';

function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    idCategoria: '',
    imagenUrl: '',
    activo: true,
    oferta: false,
    descuento: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  

  // --- Debounce de búsqueda ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- Fetch de productos ---
  useEffect(() => {
    fetchProductos();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, sortField, sortDirection]);

  // --- Fetch de categorías para select ---
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await categoriaService.getAll({ page: 1, limit: 100 });
      setCategorias(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar categorías');
    }
  };

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        activo: statusFilter === 'all' ? undefined : statusFilter,
        sort: sortField,
        direction: sortDirection
      };
      const res = await productosService.getAll(params);
      setProductos(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
      setTotalItems(res.data?.pagination?.totalItems || 0);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Sorting ---
  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
    setCurrentPage(1);
  };

  // --- Formulario ---
  const handleInputChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

  const handleOpenModal = (producto = null) => {
    setEditingProducto(producto);
    setFormData({
      nombre: producto?.nombre || '',
      descripcion: producto?.descripcion || '',
      precio: producto?.precio || 0,
      idCategoria: producto?.idCategoria || '',
      imagenUrl: producto?.imagenUrl || '',
      activo: producto?.activo ?? true,
      oferta: producto?.oferta ?? false,
      descuento: producto?.descuento ?? 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const admin = JSON.parse(localStorage.getItem("admin")) || {};
      
      let dataToSend;
    
      // Verificamos si hay una imagen (archivo)
      if (formData.imagen instanceof File) {
        dataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            dataToSend.append(key, value);
          }
        });
      
        // Campos obligatorios si no están
        if (!formData.actividadDeportiva) dataToSend.append("actividadDeportiva", "General");
        if (!formData.idAdministrador) dataToSend.append("idAdministrador", admin.id || 1);
      
        // Envío al backend
        if (editingProducto) {
          await productosService.update(editingProducto.id, dataToSend, token, true);
        } else {
          await productosService.create(dataToSend, token, true);
        }
      } else {
        // Envío como JSON normal
        const plainData = {
          ...formData,
          actividadDeportiva: formData.actividadDeportiva || "General",
          idAdministrador: formData.idAdministrador || admin.id || 1,
        };
      
        if (editingProducto) {
          await productosService.update(editingProducto.id, plainData, token);
        } else {
          await productosService.create(plainData, token);
        }
      }
    
      fetchProductos(); // refresca la lista
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };


  // --- Restaurar / Eliminar ---
  const handleRestaurar = async (id) => {
    try {
      const { data } = await productosService.restore(id);
      toast.success(data.message || 'Producto restaurado');
      fetchProductos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al restaurar producto');
    }
  };

  const handleDeleteClick = (producto) => { setProductoToDelete(producto); setShowDeleteConfirm(true); };
  const handleConfirmDelete = async () => {
    if (!productoToDelete) return;
    try {
      await productosService.delete(productoToDelete.id);
      toast.success('Producto eliminado con éxito');
      fetchProductos();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar producto');
    }
    setShowDeleteConfirm(false);
    setProductoToDelete(null);
  };
  const handleCancelDelete = () => { setShowDeleteConfirm(false); setProductoToDelete(null); };

  const inputClasses = "w-full p-2 border border-blue-600 rounded bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800";

  // --- Renderizado ---
  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-50 flex items-center">
            <Package className="mr-2" /> Gestión de Productos
          </h1>
          <p className="text-gray-200 mt-1">Administra los productos de la Tienda</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar producto..."
              className={`${inputClasses} pl-10`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-blue-600 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-200 shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex justify-end items-center mb-4">
          <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-100">Mostrar</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border-gray-300 bg-white  rounded-md px-2 py-1 text-sm  "
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2 text-sm text-gray-100">registros por página</span>
        </div>

        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-blue-900">
            <tr>
              {['nombre','descripcion','precio','activo','categoria','imagen','updatedAt'].map(field => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    {field === 'nombre' ? 'Nombre' :
                     field === 'descripcion' ? 'Descripción' :
                     field === 'precio' ? 'Precio' :
                     field === 'activo' ? 'Estado' :
                     field === 'categoria' ? 'Categoría' :
                     field === 'imagen' ? 'Imagen' :
                     'Última Modificación'}
                    {sortField === field && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <RenderSkeletonRows itemsPerPage={itemsPerPage} />
            ) : (
              productos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{p.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{p.descripcion}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">${p.precio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.activo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{p.categoria?.nombre || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {/* <img src={p.imagenUrl} alt={p.nombre} className="h-12 w-12 object-cover rounded" /> */}
                    <img
                      src={p.imagenUrl ? p.imagenUrl.startsWith("http") ? p.imagenUrl
                            : `http://localhost:3000${p.imagenUrl}`
                            : "https://via.placeholder.com/300"
                      }
                      alt={p.nombre}
                      className="h-12 w-12 object-cover rounded" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{moment(p.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    {!p.activo ? (
                      <button onClick={() => handleRestaurar(p.id)} className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1">
                        <RotateCw className="h-4 w-4" /> Restaurar
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleOpenModal(p)} className="text-blue-700 hover:text-blue-900" title="Editar">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteClick(p)} className="text-red-600 hover:text-red-900" title="Eliminar">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProducto ? 'Editar Producto' : 'Crear Nuevo Producto'}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={inputClasses}
                required
              />
            </div>
      
            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                className={inputClasses}
              />
            </div>
      
            {/* Precio */}
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className={inputClasses}
                required
              />
            </div>
      
            {/* Categoría */}
            <div>
              <label htmlFor="idCategoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría
              </label>
              <select
                id="idCategoria"
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleInputChange}
                className={inputClasses}
                required
              >
                <option value="">Seleccione categoría</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
              
            {/* Imagen: opción 1 - subir archivo */}
            <div>
              <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Imagen (archivo)
              </label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, imagen: file });
                    // mostrar vista previa temporal
                    const previewUrl = URL.createObjectURL(file);
                    setFormData(prev => ({ ...prev, imagenUrl: previewUrl }));
                  }
                }}
                className={inputClasses}
              />
            </div>
              
            {/* Imagen: opción 2 - URL externa */}
            <div>
              <label htmlFor="imagenUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL de Imagen (opcional)
              </label>
              <input
                type="text"
                id="imagenUrl"
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
              
            {/* Vista previa */}
            {formData.imagenUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                <img
                  src={
                    formData.imagenUrl.startsWith('http')
                      ? formData.imagenUrl
                      : formData.imagenUrl.startsWith('blob:')
                      ? formData.imagenUrl // imagen temporal desde file input
                      : `http://localhost:3000${formData.imagenUrl}`
                  }
                  alt="Vista previa"
                  className="h-32 w-auto object-cover rounded border"
                />
              </div>
            )}

            {/* Checkboxes */}
            <div className="flex items-center space-x-4">
              <div>
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Activo
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="oferta"
                  name="oferta"
                  checked={formData.oferta}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="oferta" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  En Oferta
                </label>
              </div>
            </div>
          
            {/* Descuento */}
            <div>
              <label htmlFor="descuento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                id="descuento"
                name="descuento"
                value={formData.descuento}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
          
            {/* Botones */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
              >
                {editingProducto ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>
      )}


      {/* Confirmación eliminación */}
      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          title="Confirmar Eliminación"
          onConfirm={handleConfirmDelete}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmClass="bg-red-500 hover:bg-red-600 text-white"
        >
          ¿Estás seguro de eliminar este producto?
        </ConfirmationDialog>
      )}
    </div>
  );
}

export default GestionProductos;
