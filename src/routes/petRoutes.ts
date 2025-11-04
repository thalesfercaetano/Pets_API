// Este arquivo define as rotas relacionadas a pets

import { Router } from "express";
import { PetController } from "../controllers/petController";

// Cria um roteador para organizar as rotas de pets
const router = Router();

// Cria uma instância do controller para usar nos métodos
const petController = new PetController();

// GET /pets - Lista todos os pets cadastrados
router.get("/", (req, res) => petController.listarPets(req, res));

// POST /pets - Cadastra um novo pet no sistema
router.post("/", (req, res) => petController.criarPet(req, res));

// GET /pets/:id - Busca um pet específico pelo seu ID
router.get("/:id", (req, res) => petController.buscarPetPorId(req, res));

// PATCH /pets/:id - Atualiza os dados de um pet existente
router.patch("/:id", (req, res) => petController.atualizarPet(req, res));

// DELETE /pets/:id - Remove um pet do sistema
router.delete("/:id", (req, res) => petController.deletarPet(req, res));

export default router;

