// Este arquivo define as rotas relacionadas a doações

import express from "express";
import { DoacaoController } from "../controllers/doacaoController";

// Cria um roteador para organizar as rotas de doações
const router = express.Router();

// Cria uma instância do controller para usar nos métodos
const doacaoController = new DoacaoController();

// POST /doacoes - Registra uma nova doação de item
router.post("/", doacaoController.registrarDoacao);

export default router;

