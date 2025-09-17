import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './src/db/connection.js'; // Conexión a la BD
import routerPrincipal from './src/routes/index.js'; // Rutas principales
import { notFound, errorHandler } from './src/middleware/errorHandler.js';
import passport from './src/config/passport.js';
import cookieParser from 'cookie-parser';


//  1. Cargar variables de entorno
dotenv.config(); // Lee el archivo .env  //Esto debe ir antes que cualquier uso de process.env

//  2. Inicialización de la app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================
//  3. Middlewares globales
// ============================

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://tu-dominio.com'] // Ajustar en producción
        : ['http://localhost:5173', 'http://localhost:5174'],  // ['*']. para no filtrar ninguna IP. Ajustar según tu front en desarrollo
    credentials: true
}));

// Logging de peticiones HTTP (más detallado en desarrollo)
app.use(morgan(process.env.NODE_ENV === 'development' ? "dev" : "combined")); // morgan imprime en la consola las peticiones que recibe tu servidor ej: GET /api/productos 200 15ms

// Parsing de datos (JSON y URL encoded)
app.use(express.json({ limit: '10mb' })); // convierte el body a JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Inicializar Passport (SIN sesiones para JWT)
app.use(passport.initialize());

// Middleware para parsear cookies
app.use(cookieParser());


// 4. Ruta de salud de la API
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Agrega esto ANTES de tus rutas
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// O específico para la ruta Google:
app.get('/api/auth/google', (req, res, next) => {
  console.log('🔵 Google Auth iniciado - Redirigiendo a Google...');
  next();
});

// 5. Rutas principales
app.use('/api', routerPrincipal); // cualquier ruta declarada en routes/index.js queda prefijada con /api.

// 6. Manejo de errores
app.use(notFound); // Middleware para rutas no encontradas
app.use(errorHandler); // Middleware de manejo de errores (debe ir al final)


// 7. Sincronización con la BD y arranque del servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincroniza los modelos con la base de datos.
    // force: false (default) - No borra tablas si existen.
    // force: true - Borra y recrea tablas. ¡PELIGROSO en producción!
    // alter: true - Intenta modificar tablas existentes.
    await sequelize.sync({ force: false }); // Cambia bajo tu propio riesgo. ¿¿Ver si debe ir: ({ alter: true });
    console.log('🔄 Modelos sincronizados con la base de datos.');

     // Iniciar el servidor  
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1); // Detener el proceso si falla la conexión
  }
}

startServer();


