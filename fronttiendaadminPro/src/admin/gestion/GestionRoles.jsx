import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Search, Filter, Key, RotateCw } from 'lucide-react';
import rolService from '../../services/rolService';
import BackToDashboardButton from "../components/BackToDashboardButton";

import * as toast from '../../utils/toast';

import ConfirmationDialog from '../../components/ConfirmationDialog';
import Modal from '../../components/Modal';
import Pagination from '../../components/Paginacion';
import RenderSkeletonRows from '../../components/RenderSkeletonRows';

function GestionRoles() {
  // ===== Estados principales =====
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletedFilter, setDeletedFilter] = useState('all');
  const [sortField, setSortField] = useState('codigo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRol, setEditingRol] = useState(null);
  const [formData, setFormData] = useState({ codigo: '', descripcion: '', activo: true });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rolToDelete, setRolToDelete] = useState(null);

  const [loading, setLoading] = useState(false);

  
   // ===== Debounce de búsqueda =====
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); 
    }, 500)
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch roles cuando cambian filtros
  useEffect(() => { 
    fetchRoles(); 
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, deletedFilter, sortField, sortDirection]);

  // ===== Obtener todos los roles con filtros y paginación =====
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        activo: statusFilter === 'all' ? undefined : statusFilter === 'true',
        eliminado: deletedFilter === 'all' ? undefined : deletedFilter === 'true',
        sort: sortField,
        direction: sortDirection
      };

      const response = await rolService.getAll(params);
      const data = response.data?.data || [];
      setRoles(data);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setTotalItems(response.data?.pagination?.totalItems || 0);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      toast.error('Error al cargar los roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Ordenamiento por columna =====
  const handleSort = (column) => {
    if (sortField === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else { 
      setSortField(column); 
      setSortDirection('asc'); 
    }
      setCurrentPage(1);
  };

   // ===== Inputs =====
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ===== Abrir modal crear/editar =====
  const handleOpenModal = (rol = null) => {
    if (rol) {
      setEditingRol(rol);
      setFormData({ codigo: rol.codigo, descripcion: rol.descripcion || '', activo: rol.activo });
    } else {
      setEditingRol(null);
      setFormData({ codigo: '', descripcion: '', activo: true });
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  // ===== Crear / Editar rol =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { 
      nombre: formData.codigo, 
      descripcion: formData.descripcion, 
      activo: formData.activo, 
      eliminado: false };
    try {
      if (editingRol) await rolService.update(editingRol.id, dataToSend), toast.success('Rol actualizado con éxito');
      else await rolService.create(dataToSend), toast.success('Rol creado con éxito');
      handleCloseModal();
      fetchRoles();
    } catch (error) {
      console.error('Error al guardar rol:', error.response?.data);
      if (error.response?.data?.errors?.length) error.response.data.errors.forEach(err => toast.error(err.msg || err.message));
      else toast.error(error.response?.data?.message || 'Error al guardar rol');
    }
  };

  // ===== Delete/Resort =====
  const handleDeleteClick = (rol) => { setRolToDelete(rol); setShowDeleteConfirm(true); };
  const handleConfirmDelete = async () => {
    if (!rolToDelete) return;
    try { 
      await rolService.delete(rolToDelete.id); 
      toast.success('Rol eliminado con éxito'); 
      fetchRoles(); 
    } catch (error) { 
      console.error(error); 
      toast.error('Error al eliminar rol'); 
    }
    setShowDeleteConfirm(false); setRolToDelete(null);
  };

  const handleCancelDelete = () => { setShowDeleteConfirm(false); setRolToDelete(null); };
  const handleRestore = async (rol) => {
    try { 
      await rolService.restore(rol.id); 
      toast.success('Rol restaurado (quedó inactivo)'); 
      fetchRoles(); 
    } catch (e) { 
      console.error(e); 
      toast.error('No se pudo restaurar el rol'); }
  };

  const paginatedRoles = roles || [];

  // Clases comunes Tailwind ajustadas para modal legible
  const inputClasses = "w-full p-2 border border-blue-600 rounded bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800";
  const selectClasses = "pl-10 pr-4 py-2 border border-blue-600 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 appearance-none";

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      {/* ===== Header ===== */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-50 flex items-center">
            <Key className="mr-2" /> Gestión de Roles
          </h1>
          <div className="flex flex-col space-y-4">
            <p className="text-gray-200 mt-1">Administra los roles del sistema</p>
            {/* <BackToDashboardButton /> */}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Buscador */}
          <div className="relative">
            <input type="text" 
            placeholder="Buscar rol..." 
            className={`${inputClasses} pl-10`} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          {/* Filtros activo/inactivo  eliminado/Noeliminado */}
          <div className="relative">
            <select className={selectClasses} 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          {/* <div className="relative">
            <select className={selectClasses} value={deletedFilter} onChange={(e) => setDeletedFilter(e.target.value)}>
              <option value="all">Todos (eliminados y no)</option>
              <option value="false">Solo NO eliminados</option>
              <option value="true">Solo eliminados</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div> */}

          {/* Botón nuevo administrador */}
          <button onClick={() => handleOpenModal()} 
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-200 shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" /> 
            Nuevo Rol
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
      {/* ===== Tabla de roles ===== */}
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-blue-900">
            <tr>
              {['codigo', 'descripcion', 'activo'].map(col => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer" 
                onClick={() => handleSort(col)}>
                  <div className="flex items-center">
                    {col === 'codigo' ? 'Código' : col === 'descripcion' ? 'Descripción' : 'Estado'}
                    {sortField === col && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? <RenderSkeletonRows itemsPerPage={itemsPerPage} /> :
              paginatedRoles.map(rol => (
                <tr key={rol.id} className="hover:bg-blue-50 dark:hover:bg-blue-900">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rol.codigo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{rol.descripcion || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rol.eliminado ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      rol.activo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {rol.eliminado ? 'Eliminado' : rol.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {rol.eliminado ? (
                        <button onClick={() => handleRestore(rol)} className="text-amber-600 hover:text-amber-800 flex items-center gap-1" title="Restaurar">
                          <RotateCw className="h-4 w-4" /> Restaurar
                        </button>
                      ) : (
                        <>
                          <button 
                          onClick={() => handleOpenModal(rol)} 
                          className="text-blue-700 hover:text-blue-900" title="Editar"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                          onClick={() => handleDeleteClick(rol)} 
                          className="text-red-600 hover:text-red-900" title="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* ===== Paginación ===== */}
      <Pagination 
      currentPage={currentPage} 
      totalPages={totalPages} 
      totalItems={totalItems} 
      itemsPerPage={itemsPerPage} 
      onPageChange={setCurrentPage} />

      {/* ===== Modal Crear/Editar rol ===== */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRol ? 'Editar Rol' : 'Crear Nuevo Rol'}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-gray-900 mb-1">Código</label>
                <input type="text" id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} className={inputClasses} required />
              </div>
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-900 mb-1">Descripción</label>
                <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} className={inputClasses} rows="3" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="activo" name="activo" checked={formData.activo} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">Activo</label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
              type="button" 
              onClick={handleCloseModal} 
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancelar</button>
              <button 
              type="submit" 
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900">{editingRol ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </Modal>
      )}

       {/* ===== Confirmación eliminación ===== */}
      {showDeleteConfirm && (
        <ConfirmationDialog 
        isOpen={showDeleteConfirm} 
        onClose={handleCancelDelete} 
        title="Confirmar Eliminación" 
        onConfirm={handleConfirmDelete} 
        confirmText="Eliminar" 
        cancelText="Cancelar" 
        confirmClass="bg-red-500 hover:bg-red-600">
          ¿Estás seguro de que deseas eliminar el rol 
          <strong>
            {rolToDelete?.codigo}</strong>? Esta acción no se puede deshacer.
        </ConfirmationDialog>
      )}
    </div>
  );
}

export default GestionRoles;                                                                         

