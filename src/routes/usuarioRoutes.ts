import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController";

const router = Router();
const usuarioController = new UsuarioController();

// POST /usuarios - Cadastrar novo usuário
router.post("/usuarios", (req, res) => usuarioController.criarUsuario(req, res));

// POST /usuarios/login - Login e geração de token JWT
router.post("/usuarios/login", (req, res) => usuarioController.login(req, res));

// GET /usuarios/:id - Buscar usuário por ID
router.get("/usuarios/:id", (req, res) => usuarioController.buscarUsuarioPorId(req, res));

// PATCH /usuarios/:id - Atualizar nome ou email
router.patch("/usuarios/:id", (req, res) => usuarioController.atualizarUsuario(req, res));

// DELETE /usuarios/:id - Excluir usuário
router.delete("/usuarios/:id", (req, res) => usuarioController.deletarUsuario(req, res));

export default router;

