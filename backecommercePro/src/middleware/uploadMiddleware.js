import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración del almacenamiento dinámico
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Detectar si la ruta incluye "categorias"
    const isCategoria = req.originalUrl.includes("/categorias");

    const folder = isCategoria
      ? "uploads/categorias/"
      : "uploads/productos/";

    // Crear la carpeta si no existe
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Solo se permiten archivos de imagen."), false);
};

export const upload = multer({ storage, fileFilter });




// import multer from "multer";
// import path from "path";

// // Configuración del almacenamiento
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/productos/"); // carpeta donde se guardarán las imágenes
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // nombre único
//   }
// });

// // Filtro para aceptar solo imágenes
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Solo se permiten archivos de imagen."), false);
// };

// export const upload = multer({ storage, fileFilter });
