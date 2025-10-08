import { Router } from 'express';
import { 
    getDashboardStats,
} from "../controllers/panelAdmin.Controller.js";

const router = Router();


// Dashboard principal para obtener estadísticas del dashboard
router.get("/dashboard", getDashboardStats);



export default router;
