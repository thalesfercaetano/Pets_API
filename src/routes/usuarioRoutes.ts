// Este arquivo define as rotas relacionadas a usuários

import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController";

// Cria um roteador para organizar as rotas de usuários
const router = Router();

// Cria uma instância do controller para usar nos métodos
const usuarioController = new UsuarioController();

// POST /usuarios - Cadastrar novo usuário (cria uma conta)
router.post("/", (req, res) => usuarioController.criarUsuario(req, res));

// POST /usuarios/login - Fazer login e receber um token de autenticação
router.post("/login", (req, res) => usuarioController.login(req, res));

// GET /usuarios/:id - Buscar um usuário específico pelo seu ID
router.get("/:id", (req, res) => usuarioController.buscarUsuarioPorId(req, res));

// PATCH /usuarios/:id - Atualizar nome ou email de um usuário
router.patch("/:id", (req, res) => usuarioController.atualizarUsuario(req, res));

// DELETE /usuarios/:id - Excluir um usuário
router.delete("/:id", (req, res) => usuarioController.deletarUsuario(req, res));

export default router;

