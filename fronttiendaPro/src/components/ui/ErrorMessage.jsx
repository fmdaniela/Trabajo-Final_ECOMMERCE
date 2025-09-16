function ErrorMessage({ mensaje }) {
  return (
    <div className="text-red-500 p-4 text-center">
      {mensaje || 'Ocurrió un error inesperado.'}
    </div>
  );
}

export default ErrorMessage;

