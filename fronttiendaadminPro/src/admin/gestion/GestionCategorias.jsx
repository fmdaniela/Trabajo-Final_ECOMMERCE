import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Search, Filter, Tag, RotateCw } from 'lucide-react';
import categoriaService from '../../services/categoriaService';

import * as toast from '../../utils/toast';

import ConfirmationDialog from '../../components/ConfirmationDialog';
import Modal from '../../components/Modal';
import Pagination from '../../components/Paginacion';
import RenderSkeletonRows from '../../components/RenderSkeletonRows';

function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [productosCount, setProductosCount] = useState({});
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', activa: true, imagenFile: null, imagenUrl: '' });

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
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);

  // --- Debounce de búsqueda ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- Fetch de categorías ---
  useEffect(() => {
    fetchCategorias();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, sortField, sortDirection]);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        activa: statusFilter === 'all' ? undefined : statusFilter,
        sort: sortField,
        direction: sortDirection
      };
      const response = await categoriaService.getAll(params);
      const data = response.data?.data || [];
      setCategorias(data);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setTotalItems(response.data?.pagination?.totalItems || 0);
      await fetchProductosCount(data.map(c => c.id));
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar las categorías');
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductosCount = async (ids) => {
    try {
      const counts = {};
      for (const id of ids) {
        const res = await categoriaService.getProductosByCategoria(id, { limit: 1 });
        counts[id] = res.data.pagination?.totalItems || 0;
      }
      setProductosCount(counts);
    } catch (error) {
      console.error(error);
    }
  };

  // --- Sorting ---
  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
    setCurrentPage(1);
  };

  // --- Formulario ---
  const handleInputChange = ({ target: { name, value, type, checked, files } }) => {
    if (name === 'imagen') setFormData(prev => ({ ...prev, imagenFile: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleOpenModal = (categoria = null) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria?.nombre || '',
      descripcion: categoria?.descripcion || '',
      activa: categoria?.activa ?? true,
      imagenUrl: categoria?.imagenUrl || '',
      imagenFile: null
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append('nombre', formData.nombre);
      formPayload.append('descripcion', formData.descripcion);
      formPayload.append('activa', formData.activa);
      if (formData.imagenFile) formPayload.append('imagen', formData.imagenFile);

      if (editingCategoria) {
        await categoriaService.update(editingCategoria.id, formPayload, true);
        toast.success('Categoría actualizada con éxito');
      } else {
        await categoriaService.create(formPayload, true);
        toast.success('Categoría creada con éxito');
      }
      handleCloseModal();
      fetchCategorias();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al guardar categoría');
    }
  };

  // --- Restaurar / Eliminar ---
  const handleRestaurar = async (id) => {
    try {
      const { data } = await categoriaService.restore(id);
      toast.success(data.message);
      fetchCategorias();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al restaurar categoría');
    }
  };

  const handleDeleteClick = (categoria) => { setCategoriaToDelete(categoria); setShowDeleteConfirm(true); };
  const handleConfirmDelete = async () => {
    if (!categoriaToDelete) return;
    try {
      await categoriaService.delete(categoriaToDelete.id);
      toast.success('Categoría eliminada con éxito');
      fetchCategorias();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar categoría');
    }
    setShowDeleteConfirm(false);
    setCategoriaToDelete(null);
  };
  const handleCancelDelete = () => { setShowDeleteConfirm(false); setCategoriaToDelete(null); };

  const inputClasses = "w-full p-2 border border-blue-600 rounded bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800";
  const selectClasses = "pl-10 pr-4 py-2 border border-blue-600 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 appearance-none";

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-50 flex items-center">
            <Tag className="mr-2" /> Gestión de Categorías
          </h1>
          <p className="text-gray-200 mt-1">Administra las categorías de productos</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar categoría..."
              className={`${inputClasses} pl-10`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          <div className="relative">
            <select
              className={selectClasses}
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
            <Plus className="h-5 w-5 mr-2" /> Nueva Categoría
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
              {['nombre', 'descripcion', 'activa'].map(field => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    {field === 'nombre' ? 'Nombre' :
                     field === 'descripcion' ? 'Descripción' :
                     'Estado'}
                    {sortField === field && (
                      sortDirection === 'asc'
                        ? <ChevronUp className="h-4 w-4 ml-1" />
                        : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Productos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
            
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <RenderSkeletonRows itemsPerPage={itemsPerPage} />
            ) : (
              categorias.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{c.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{c.descripcion || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.activa ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {c.activa ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {c.imagenUrl ? (
                      <img src={c.imagenUrl} alt={c.nombre} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {productosCount[c.id] || 0} productos
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    {!c.activa ? (
                      <button onClick={() => handleRestaurar(c.id)} className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1">
                        <RotateCw className="h-4 w-4" /> Restaurar
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleOpenModal(c)} className="text-blue-700 hover:text-blue-900" title="Editar">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteClick(c)} className="text-red-600 hover:text-red-900" title="Eliminar">
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
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} className={inputClasses} required />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows="3" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen</label>
              <input 
                type="file" 
                id="imagen" 
                name="imagen" 
                accept="image/*" 
                onChange={handleInputChange} 
                className={inputClasses} 
              />
              {formData.imagenUrl && !formData.imagenFile && (
                <img src={formData.imagenUrl} alt="preview" className="h-16 w-16 mt-2 object-cover rounded" />
              )}
              {formData.imagenFile && (
                <img src={URL.createObjectURL(formData.imagenFile)} alt="preview" className="h-16 w-16 mt-2 object-cover rounded" />
              )}
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="activa" name="activa" checked={formData.activa} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="activa" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Activo</label>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900">{editingCategoria ? 'Actualizar' : 'Crear'}</button>
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
          ¿Estás seguro de que deseas eliminar la categoría <strong>{categoriaToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
          {productosCount[categoriaToDelete?.id] > 0 && (
            <p className="mt-2 text-yellow-600 dark:text-yellow-400">
              ¡Atención! Esta categoría tiene {productosCount[categoriaToDelete?.id]} productos asociados.
            </p>
          )}
        </ConfirmationDialog>
      )}
    </div>
  );
}

export default GestionCategorias;
