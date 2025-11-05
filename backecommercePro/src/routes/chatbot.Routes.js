import { Router } from "express";
import { chatQuery } from "../controllers/chatbot.Controller.js";

const router = Router();

router.post("/chat-query", chatQuery);

export default router;
