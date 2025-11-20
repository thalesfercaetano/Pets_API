// Este arquivo define as rotas relacionadas a endereços

import { Router } from "express";
import { EnderecoController } from "../controllers/enderecoController";

// Cria um roteador para organizar as rotas de endereços
const router = Router();

// Cria uma instância do controller para usar nos métodos
const enderecoController = new EnderecoController();

// GET /enderecos - Listar todos os endereços
router.get("/", (req, res) => enderecoController.listarEnderecos(req, res));

// POST /enderecos - Cadastrar novo endereço
router.post("/", (req, res) => enderecoController.criarEndereco(req, res));

// GET /enderecos/:id - Buscar um endereço específico pelo seu ID
router.get("/:id", (req, res) => enderecoController.buscarEnderecoPorId(req, res));

// PATCH /enderecos/:id - Atualizar dados de um endereço
router.patch("/:id", (req, res) => enderecoController.atualizarEndereco(req, res));

// DELETE /enderecos/:id - Excluir um endereço
router.delete("/:id", (req, res) => enderecoController.deletarEndereco(req, res));

export default router;

