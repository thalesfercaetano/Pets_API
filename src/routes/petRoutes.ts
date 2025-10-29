import { Router } from "express";
import { PetController } from "../controllers/petController";
import { Pet } from '../models/Pet';

const router = Router();
const petController = new PetController();

// GET /pets - Listar todos os pets
router.get("/pets", (req, res) => petController.listarPets(req, res));

// POST /pets - Cadastrar pet
router.post("/pets", async (req, res) => {
    const { name, type, owner_id } = req.body;
    const pet: Pet = { name, type, owner_id };
    try {
        const newPet = await petController.criarPet(pet);
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar pet', error });
    }
});

// GET /pets/:id - Detalhar pet
router.get("/pets/:id", (req, res) => petController.buscarPetPorId(req, res));

// PATCH /pets/:id - Atualizar dados do pet
router.patch("/pets/:id", (req, res) => petController.atualizarPet(req, res));

// DELETE /pets/:id - Excluir pet
router.delete("/pets/:id", (req, res) => petController.deletarPet(req, res));

export default router;

