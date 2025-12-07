// Este arquivo é o Controller de Instituições

import { Request, Response } from "express";
import { InstituicaoBusiness } from "../business/instituicaoBusiness";

// Cria uma instância da classe de negócio para usar nos métodos
const instituicaoBusiness = new InstituicaoBusiness();

export class InstituicaoController {
  // Rota GET /instituicoes - Lista todas as instituições
  async listarInstituicoes(req: Request, res: Response): Promise<void> {
    try {
      const instituicoes = await instituicaoBusiness.listarInstituicoes();
      
      res.status(200).json(instituicoes);
    } catch (error) {
      console.error("Erro ao listar instituições:", error);
      res.status(500).send("Erro ao listar instituições");
    }
  }

  // Rota POST /instituicoes - Cria uma nova instituição
  async criarInstituicao(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, cnpj, telefone, link_site, descricao, endereco_id } = req.body;

      if (!nome || !email) {
        res.status(400).send("Nome e email são obrigatórios");
        return;
      }

      const novaInstituicao = await instituicaoBusiness.criarInstituicao({
        nome,
        email,
        cnpj,
        telefone,
        link_site,
        descricao,
        endereco_id,
      });
      
      res.status(201).json(novaInstituicao);
    } catch (error: any) {
      console.error("Erro ao criar instituição:", error);
      
      if (error.message === "Email já cadastrado" || error.message === "CNPJ já cadastrado") {
        res.status(409).send(error.message);
      } else if (error.message && error.message.includes("dados não retornados")) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Erro ao criar instituição");
      }
    }
  }

  // Rota GET /instituicoes/:id - Busca uma instituição específica pelo seu ID
  async buscarInstituicaoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const instituicaoId = parseInt(id);

      if (isNaN(instituicaoId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const instituicao = await instituicaoBusiness.buscarInstituicaoPorId(instituicaoId);
      
      if (instituicao) {
        res.status(200).json(instituicao);
      } else {
        // Se não encontrou, retorna 404
        res.status(404).send("Instituição não encontrada");
      }
    } catch (error: any) {
      // Log do erro real para debug no terminal
      console.error("Erro ao buscar instituição por ID:", error);
      res.status(500).send(error.message || "Erro ao buscar instituição");
    }
  }

  // Rota PATCH /instituicoes/:id - Atualiza os dados de uma instituição
  async atualizarInstituicao(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, email, cnpj, telefone, link_site, descricao, endereco_id } = req.body;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const instituicaoId = parseInt(id);

      if (isNaN(instituicaoId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const atualizado = await instituicaoBusiness.atualizarInstituicao(instituicaoId, {
        nome,
        email,
        cnpj,
        telefone,
        link_site,
        descricao,
        endereco_id,
      });
      
      if (atualizado) {
        res.status(200).send("Instituição atualizada com sucesso");
      } else {
        res.status(404).send("Instituição não encontrada");
      }
    } catch (error: any) {
      console.error("Erro ao atualizar instituição:", error);
      
      if (
        error.message === "Email já está em uso por outra instituição" ||
        error.message === "CNPJ já está em uso por outra instituição"
      ) {
        res.status(409).send(error.message);
      } else {
        res.status(500).send("Erro ao atualizar instituição");
      }
    }
  }

  // Rota DELETE /instituicoes/:id - Deleta uma instituição
  async deletarInstituicao(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const instituicaoId = parseInt(id);

      if (isNaN(instituicaoId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const deletado = await instituicaoBusiness.deletarInstituicao(instituicaoId);
      
      if (deletado) {
        res.status(200).send("Instituição deletada com sucesso");
      } else {
        res.status(404).send("Instituição não encontrada");
      }
    } catch (error) {
      console.error("Erro ao deletar instituição:", error);
      res.status(500).send("Erro ao deletar instituição");
    }
  }
}