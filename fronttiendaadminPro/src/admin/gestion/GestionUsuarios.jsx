import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Search, Filter, User, RotateCw } from 'lucide-react';
import usuarioService from '../../services/usuarioService';

import * as toast from '../../utils/toast';

import ConfirmationDialog from '../../components/ConfirmationDialog';
import Modal from '../../components/Modal';
import Pagination from '../../components/Paginacion';
import RenderSkeletonRows from '../../components/RenderSkeletonRows';



function GestionUsuarios() {
  // ===== Estados principales =====
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // ===== Modal y formulario =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    activo: true
  });

  // ===== Confirmación de eliminación =====
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const [loading, setLoading] = useState(false);

  // ===== Debounce de búsqueda =====
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ===== Fetch usuarios =====
  useEffect(() => {
    fetchUsuarios();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, sortField, sortDirection]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        activo: statusFilter === 'all' ? undefined : statusFilter === 'true',
        sort: sortField,
        direction: sortDirection
      };
      const response = await usuarioService.getAll(params);
      if (response.data?.data) {
        setUsuarios(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setUsuarios([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Ordenamiento =====
  const handleSort = (column) => {
    if (sortField === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // ===== Cambios en formulario =====
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ===== Modal Crear/Editar =====
  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        password: '',
        activo: usuario.activo
      });
    } else {
      setEditingUsuario(null);
      setFormData({ nombre: '', apellido: '', email: '', password: '', activo: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // ===== Crear/Actualizar usuario =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim(),
      password: formData.password,
      idRol: 3, // USER fijo
      activo: formData.activo
    };
    if (editingUsuario && !dataToSend.password) delete dataToSend.password;

    try {
      if (editingUsuario) {
        await usuarioService.update(editingUsuario.id, dataToSend);
        toast.success('Usuario actualizado con éxito');
      } else {
        await usuarioService.create(dataToSend);
        toast.success('Usuario creado con éxito');
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    }
  };

  // ===== Eliminar/Restaurar =====
  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setShowDeleteConfirm(true);
  };
  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return;
    try {
      await usuarioService.delete(usuarioToDelete.id);
      toast.success('Usuario desactivado con éxito');
      fetchUsuarios();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar usuario');
    } finally {
      setShowDeleteConfirm(false);
      setUsuarioToDelete(null);
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setUsuarioToDelete(null);
  };
  const handleRestore = async (usuario) => {
    try {
      await usuarioService.restore(usuario.id);
      toast.success('Usuario restaurado con éxito');
      fetchUsuarios();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo restaurar el usuario');
    }
  };

  const paginatedUsuarios = usuarios || [];

  // Clases comunes Tailwind ajustadas para modal legible
  const inputClasses = "w-full p-2 border border-blue-600 rounded bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800";
  const selectClasses = "pl-10 pr-4 py-2 border border-blue-600 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 appearance-none";

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      {/* ===== Header ===== */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-50 flex items-center">
            <User className="mr-2" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-200 mt-1">Administra los clientes de la tienda</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClasses} pl-10`}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectClasses}
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
            <Plus className="h-5 w-5 mr-2" /> Nuevo Usuario
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
      {/* ===== Tabla ===== */}
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-blue-900">
            <tr>
              <th onClick={() => handleSort('nombre')} className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer">
                Nombre {sortField === 'nombre' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
              </th>
              <th onClick={() => handleSort('apellido')} className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer">
                Apellido {sortField === 'apellido' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
              </th>
              <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer">
                Email {sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Rol</th>
              <th onClick={() => handleSort('activo')} className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer">
                Estado {sortField === 'activo' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <RenderSkeletonRows itemsPerPage={itemsPerPage} />
            ) : (
              paginatedUsuarios.map(usuario => (
                <tr key={usuario.id} className="hover:bg-blue-50 dark:hover:bg-blue-900">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{usuario.apellido}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{usuario.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">USER</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.activo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!usuario.activo ? (
                      <button onClick={() => handleRestore(usuario)} className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1" title="Restaurar">
                        <RotateCw className="h-4 w-4" /> Restaurar
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleOpenModal(usuario)} className="text-blue-700 hover:text-blue-900" title="Editar">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteClick(usuario)} className="text-red-600 hover:text-red-900" title="Eliminar">
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

      {/* ===== Paginación ===== */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* ===== Modal ===== */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required className={inputClasses} />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
              <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} required className={inputClasses} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required readOnly={!!editingUsuario} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{editingUsuario ? 'Cambiar contraseña (opcional)' : 'Contraseña'}</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required={!editingUsuario} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
              <input type="text" id="rol" name="rol" value="USER" disabled className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="activo" name="activo" checked={formData.activo} onChange={handleInputChange} className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700" />
              <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Activo</label>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900">{editingUsuario ? 'Actualizar' : 'Crear'}</button>
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
          confirmClass="bg-red-500 hover:bg-red-600 text-white"
        >
          ¿Estás seguro de que deseas desactivar al usuario <strong>{usuarioToDelete?.nombre} {usuarioToDelete?.apellido}</strong>? Esta acción no se puede deshacer.
        </ConfirmationDialog>
      )}
    </div>
  );
}

export default GestionUsuarios;






































