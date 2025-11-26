// Este arquivo é o Controller de Matches (sistema estilo Tinder)
// Os Controllers são responsáveis por receber as requisições HTTP e enviar as respostas

import { Request, Response } from "express";
import { MatchBusiness } from "../business/matchBusiness";

// Cria uma instância da classe de negócio para usar nos métodos
const matchBusiness = new MatchBusiness();

export class MatchController {
  async descobrirPets(req: Request, res: Response): Promise<void> {
    try {
      const { usuario_id } = req.query;
      const limite = req.query.limite ? parseInt(req.query.limite as string) : 10;

      if (!usuario_id) {
        res.status(400).json({ error: "usuario_id é obrigatório" });
        return;
      }

      const usuarioId = parseInt(usuario_id as string);
      if (isNaN(usuarioId)) {
        res.status(400).json({ error: "usuario_id inválido" });
        return;
      }

      const pets = await matchBusiness.descobrirPets(usuarioId, limite);
      res.status(200).json(pets);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erro ao descobrir pets" });
    }
  }

  async descobrirUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const { instituicao_id, pet_id } = req.query;
      const limite = req.query.limite ? parseInt(req.query.limite as string) : 10;

      if (!instituicao_id || !pet_id) {
        res.status(400).json({ error: "instituicao_id e pet_id são obrigatórios" });
        return;
      }

      const instituicaoId = parseInt(instituicao_id as string);
      const petId = parseInt(pet_id as string);

      if (isNaN(instituicaoId) || isNaN(petId)) {
        res.status(400).json({ error: "IDs inválidos" });
        return;
      }

      const usuarios = await matchBusiness.descobrirUsuarios(instituicaoId, petId, limite);
      res.status(200).json(usuarios);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erro ao descobrir usuários" });
    }
  }

  async swipeUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { usuario_id, pet_id, tipo } = req.body;

      if (!usuario_id || !pet_id || !tipo) {
        res.status(400).json({ error: "usuario_id, pet_id e tipo são obrigatórios" });
        return;
      }

      if (tipo !== "like" && tipo !== "pass") {
        res.status(400).json({ error: "tipo deve ser 'like' ou 'pass'" });
        return;
      }

      const usuarioId = parseInt(usuario_id);
      const petId = parseInt(pet_id);

      if (isNaN(usuarioId) || isNaN(petId)) {
        res.status(400).json({ error: "IDs inválidos" });
        return;
      }

      const resultado = await matchBusiness.swipeUsuario(usuarioId, petId, tipo);
      res.status(200).json(resultado);
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("não encontrado") || error.message.includes("não está disponível")) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes("já avaliou")) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Erro ao registrar swipe" });
      }
    }
  }

  async swipeInstituicao(req: Request, res: Response): Promise<void> {
    try {
      const { instituicao_id, usuario_id, pet_id, tipo } = req.body;

      if (!instituicao_id || !usuario_id || !pet_id || !tipo) {
        res.status(400).json({ error: "instituicao_id, usuario_id, pet_id e tipo são obrigatórios" });
        return;
      }

      if (tipo !== "like" && tipo !== "pass") {
        res.status(400).json({ error: "tipo deve ser 'like' ou 'pass'" });
        return;
      }

      const instituicaoId = parseInt(instituicao_id);
      const usuarioId = parseInt(usuario_id);
      const petId = parseInt(pet_id);

      if (isNaN(instituicaoId) || isNaN(usuarioId) || isNaN(petId)) {
        res.status(400).json({ error: "IDs inválidos" });
        return;
      }

      const resultado = await matchBusiness.swipeInstituicao(instituicaoId, usuarioId, petId, tipo);
      res.status(200).json(resultado);
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("não encontrado") || error.message.includes("não pertence")) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes("já avaliou")) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Erro ao registrar swipe" });
      }
    }
  }

  async listarMatchesUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const usuarioId = parseInt(id);
      if (isNaN(usuarioId)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const matches = await matchBusiness.listarMatchesUsuario(usuarioId);
      res.status(200).json(matches);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erro ao listar matches" });
    }
  }

  async listarMatchesInstituicao(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const instituicaoId = parseInt(id);
      if (isNaN(instituicaoId)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const matches = await matchBusiness.listarMatchesInstituicao(instituicaoId);
      res.status(200).json(matches);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erro ao listar matches" });
    }
  }

  async buscarMatchPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { usuario_id, instituicao_id } = req.query;

      if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const matchId = parseInt(id);
      if (isNaN(matchId)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const usuarioId = usuario_id ? parseInt(usuario_id as string) : undefined;
      const instituicaoId = instituicao_id ? parseInt(instituicao_id as string) : undefined;

      const match = await matchBusiness.buscarMatchPorId(matchId, usuarioId, instituicaoId);

      if (match) {
        res.status(200).json(match);
      } else {
        res.status(404).json({ error: "Match não encontrado" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erro ao buscar match" });
    }
  }

  async atualizarStatusMatch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, usuario_id, instituicao_id } = req.body;

      if (!id || !status) {
        res.status(400).json({ error: "ID e status são obrigatórios" });
        return;
      }

      const statusValidos = ["ativo", "conversando", "adotado", "cancelado"];
      if (!statusValidos.includes(status)) {
        res.status(400).json({ error: "Status inválido. Use: ativo, conversando, adotado ou cancelado" });
        return;
      }

      const matchId = parseInt(id);
      if (isNaN(matchId)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const usuarioId = usuario_id ? parseInt(usuario_id) : undefined;
      const instituicaoId = instituicao_id ? parseInt(instituicao_id) : undefined;

      const atualizado = await matchBusiness.atualizarStatusMatch(matchId, status, usuarioId, instituicaoId);

      if (atualizado) {
        res.status(200).json({ message: "Status do match atualizado com sucesso" });
      } else {
        res.status(404).json({ error: "Match não encontrado ou você não tem permissão para atualizá-lo" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erro ao atualizar status do match" });
    }
  }
}