import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Search, Filter, Shield, RotateCw, } from "lucide-react";

import administradorService from "../../services/administradorService";
import rolService from "../../services/rolService";

import * as toast from "../../utils/toast";

import ConfirmationDialog from "../../components/ConfirmationDialog";
import Modal from "../../components/Modal";
import Pagination from "../../components/Paginacion";
import RenderSkeletonRows from "../../components/RenderSkeletonRows";


function GestionAdministradores() {
  // ===== Estados principales =====
  const [administradores, setAdministradores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // activo/inactivo
  const [sortField, setSortField] = useState("nombre");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);


  // ===== Modal y formulario =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    idRol: "",
    activo: true,
  });

  // ===== Confirmación de eliminación =====
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const [loading, setLoading] = useState(false);

  // ===== Debounce de búsqueda =====
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // ===== Fetch roles para dropdown =====
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await rolService.getAll({ limit: 100 });
        // Filtrar solo ADMIN y SUPERADMIN PARA CREAR ADMIN EN PANEL
        const adminRoles = (response.data.data || []).filter(
          (r) => r.codigo === "ADMIN" || r.codigo === "SUPERADMIN"
        );
        setRoles(adminRoles);
        
      } catch (error) {
        console.error("Error al obtener roles:", error);
        toast.error("No se pudieron cargar los roles");
      }
    };
    fetchRoles();
  }, []);

  // ===== Fetch administradores cuando cambian filtros =====
  useEffect(() => {
    fetchAdministradores();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, sortField, sortDirection]);

  // ===== Obtener todos los administradores con filtros y paginación =====
  const fetchAdministradores = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        activo: statusFilter === "all" ? undefined : statusFilter === "true",
        sort: sortField,
        direction: sortDirection,
      };

      const response = await administradorService.getAll(params);
      if (response.data && response.data.data) {
        setAdministradores(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setAdministradores([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      toast.error("Error al cargar los administradores");
      setAdministradores([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Ordenamiento por columna =====
  const handleSort = (column) => {
    if (sortField === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // ===== Cambios en inputs del formulario =====
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===== Abrir modal crear/editar =====
  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        nombre: admin.nombre,
        apellido: admin.apellido,
        email: admin.email,
        password: "",
        idRol: admin.idRol,
        activo: admin.activo,
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        idRol: "",
        activo: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // ===== Crear o actualizar administrador =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim(),
      password: formData.password,
      idRol: Number(formData.idRol),
      activo: formData.activo ?? true,
    };

    if (editingAdmin && !dataToSend.password) delete dataToSend.password;

    console.log("Formulario antes de enviar:", dataToSend);

    try {
      if (editingAdmin) {
        await administradorService.update(editingAdmin.id, dataToSend);
        toast.success("Administrador actualizado con éxito");
      } else {
        await administradorService.create(dataToSend);
        toast.success("Administrador creado con éxito");
      }
      handleCloseModal();
      fetchAdministradores();
    } catch (error) {
      console.error("Error al guardar administrador:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Error al guardar administrador");
    }
  };

  // ===== Click en eliminar =====
  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteConfirm(true);
  };

  // ===== Confirmar eliminación (soft delete) =====
  const handleConfirmDelete = async () => {
    if (adminToDelete) {
      try {
        await administradorService.delete(adminToDelete.id);
        toast.success("Administrador eliminado con éxito");
        fetchAdministradores();
      } catch (error) {
        console.error("Error al eliminar administrador:", error);
        toast.error("Error al eliminar administrador");
      }
      setShowDeleteConfirm(false);
      setAdminToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAdminToDelete(null);
  };

  // ===== Restaurar administrador desactivado =====
  const handleRestore = async (admin) => {
    try {
      await administradorService.restore(admin.id);
      toast.success("Administrador restaurado con éxito");
      fetchAdministradores();
    } catch (error) {
      console.error("Error al restaurar administrador:", error);
      toast.error("No se pudo restaurar el administrador");
    }
  };

  const paginatedAdmins = administradores || [];

  // Clases comunes Tailwind ajustadas para modal legible
  const inputClasses = "w-full p-2 border border-blue-600 rounded bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800";
  const selectClasses = "pl-10 pr-4 py-2 border border-blue-600 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 appearance-none";

  return (
    <div className="p-6 bg-slate-800 min-h-screen">
      {/* ===== Header ===== */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-50 flex items-center">
            <Shield className="mr-2" />
            Gestión de Administradores
          </h1>
          <p className="text-gray-200 mt-1">
            Administra los usuarios administradores del sistema
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar administrador..."
              className={`${inputClasses} pl-10`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          {/* Filtro activo/inactivo */}
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

          {/* Botón nuevo administrador */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-200 shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Administrador
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

      {/* ===== Tabla de administradores ===== */}
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-blue-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("nombre")}
              >
                Nombre
                {sortField === "nombre" && 
                  (sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  ))}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("apellido")}
              >
                Apellido
                {sortField === "apellido" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
                {sortField === "email" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("idRol")}
              >
                Rol
                {sortField === "idRol" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("activo")}
              >
                Estado
                {sortField === "activo" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <RenderSkeletonRows itemsPerPage={itemsPerPage} />
            ) : (
              paginatedAdmins.map((admin) => (
                <tr
                  key={admin.id} className="hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admin.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {admin.apellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {roles.find((r) => r.id === admin.idRol)?.codigo || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">
                    <span
                      className={
                        admin.activo
                          ? "px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {admin.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!admin.activo ? (
                        <button
                          onClick={() => handleRestore(admin)}
                          className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                          title="Restaurar"
                        >
                          <RotateCw className="w-4 h-4" /> Restaurar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenModal(admin)}
                            className="text-blue-700 hover:text-blue-900" title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(admin)}
                            className="text-red-600 hover:text-red-900" title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
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
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* ===== Modal Crear/Editar administrador ===== */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingAdmin ? "Editar Administrador" : "Crear Nuevo Administrador"}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
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
              <div>
                <label
                  htmlFor="apellido"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                  readOnly={!!editingAdmin}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {editingAdmin ? "Cambiar contraseña (opcional)" : "Contraseña"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required={!editingAdmin}
                />
              </div>
              <div>
                <label
                  htmlFor="idRol"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Rol
                </label>
                <select
                  id="idRol"
                  name="idRol"
                  value={formData.idRol}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                >
                  <option value="">-- Seleccionar rol --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.codigo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="w-4 h-4 border rounded text-violet-600 focus:ring-violet-500 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <label
                  htmlFor="activo"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Activo
                </label>
              </div>
            </div>
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
                {editingAdmin ? "Actualizar" : "Crear"}
              </button>
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
          confirmClass="bg-red-500 hover:bg-red-600"
        >
          ¿Estás seguro de que deseas desactivar al administrador{" "}
          <strong>
            {adminToDelete?.nombre} {adminToDelete?.apellido}
          </strong>
          ? Esta acción no se puede deshacer.
        </ConfirmationDialog>
      )}
    </div>
  );
}

export default GestionAdministradores;
























































































