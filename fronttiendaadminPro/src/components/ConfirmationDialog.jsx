import React from 'react';

/**
 * Componente reutilizable para mostrar un diálogo de confirmación con contenido personalizado.
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Determina si el diálogo está visible.
 * @param {Function} props.onClose - Función para cerrar el diálogo.
 * @param {string} props.title - Título del diálogo.
 * @param {React.ReactNode} props.children - Contenido del diálogo.
 * @param {string} props.width - Ancho del diálogo (ej. 'w-96' para 24rem).
 * @param {boolean} props.showBackdrop - Si true, muestra un fondo oscurecido.
 * @param {string} props.backdropColor - Color del fondo (por defecto rgba(0,0,0,0.5)).
 * @param {Function} props.onConfirm - Función para acción de confirmación (opcional).
 * @param {string} props.confirmText - Texto del botón de confirmación (por defecto 'Confirmar').
 * @param {string} props.cancelText - Texto del botón de cancelar (por defecto 'Cancelar').
 * @param {string} props.confirmClass - Clase CSS para el botón de confirmación.
 * @param {boolean} props.showCloseButton - Si true, muestra un botón de cierre en la esquina.
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-96',
  showBackdrop = true,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmClass = 'bg-blue-500 hover:bg-blue-600 text-white',
  showCloseButton = false
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm"
      style={{ backgroundColor: showBackdrop ? backdropColor : 'transparent' }}
    >
      <div className={`bg-white p-6 rounded-lg shadow-lg ${width} relative`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Cerrar"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
        
        {title && (
          <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        )}
        
        <div className="mb-4 text-gray-600">{children}</div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded ${confirmClass}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
