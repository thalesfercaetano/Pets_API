// Este arquivo define as rotas relacionadas ao sistema de matches estilo Tinder

import { Router } from "express";
import { MatchController } from "../controllers/matchController";

// Cria um roteador para organizar as rotas de matches
const router = Router();

const matchController = new MatchController();

router.get("/discover/pets", (req, res) => matchController.descobrirPets(req, res));

router.get("/discover/usuarios", (req, res) => matchController.descobrirUsuarios(req, res));

router.post("/swipe/usuario", (req, res) => matchController.swipeUsuario(req, res));

router.post("/swipe/instituicao", (req, res) => matchController.swipeInstituicao(req, res));

router.get("/usuario/:id", (req, res) => matchController.listarMatchesUsuario(req, res));

router.get("/instituicao/:id", (req, res) => matchController.listarMatchesInstituicao(req, res));

router.get("/:id", (req, res) => matchController.buscarMatchPorId(req, res));

router.patch("/:id/status", (req, res) => matchController.atualizarStatusMatch(req, res));

export default router;