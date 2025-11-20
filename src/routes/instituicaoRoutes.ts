// Este arquivo define as rotas relacionadas a instituições

import { Router } from "express";
import { InstituicaoController } from "../controllers/instituicaoController";

// Cria um roteador para organizar as rotas de instituições
const router = Router();

// Cria uma instância do controller para usar nos métodos
const instituicaoController = new InstituicaoController();

// GET /instituicoes - Listar todas as instituições
router.get("/", (req, res) => instituicaoController.listarInstituicoes(req, res));

// POST /instituicoes - Cadastrar nova instituição
router.post("/", (req, res) => instituicaoController.criarInstituicao(req, res));

// GET /instituicoes/:id - Buscar uma instituição específica pelo seu ID
router.get("/:id", (req, res) => instituicaoController.buscarInstituicaoPorId(req, res));

// PATCH /instituicoes/:id - Atualizar dados de uma instituição
router.patch("/:id", (req, res) => instituicaoController.atualizarInstituicao(req, res));

// DELETE /instituicoes/:id - Excluir uma instituição
router.delete("/:id", (req, res) => instituicaoController.deletarInstituicao(req, res));

export default router;

