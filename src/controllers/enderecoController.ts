// Este arquivo é o Controller de Endereços

import { Request, Response } from "express";
import { EnderecoBusiness } from "../business/enderecoBusiness";

// Cria uma instância da classe de negócio para usar nos métodos
const enderecoBusiness = new EnderecoBusiness();

export class EnderecoController {
  // Rota GET /enderecos - Lista todos os endereços
  async listarEnderecos(req: Request, res: Response): Promise<void> {
    try {
      const enderecos = await enderecoBusiness.listarEnderecos();
      
      res.status(200).json(enderecos);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao listar endereços");
    }
  }

  // Rota POST /enderecos - Cria um novo endereço
  async criarEndereco(req: Request, res: Response): Promise<void> {
    try {
      const { rua, numero, complemento, bairro, cidade, estado, cep, latitude, longitude } = req.body;

      if (!rua || !bairro || !cidade || !estado) {
        res.status(400).send("Rua, bairro, cidade e estado são obrigatórios");
        return;
      }

      if (estado && estado.length !== 2) {
        res.status(400).send("Estado deve ter 2 caracteres");
        return;
      }

      const novoEndereco = await enderecoBusiness.criarEndereco({
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        latitude,
        longitude,
      });
      
      res.status(201).json(novoEndereco);
    } catch (error: any) {
      console.error(error);
      
      if (error.message.includes("ID não retornado") || error.message.includes("Erro ao buscar")) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Erro ao criar endereço");
      }
    }
  }

  // Rota GET /enderecos/:id - Busca um endereço pelo seu ID
  async buscarEnderecoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const enderecoId = parseInt(id);

      if (isNaN(enderecoId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const endereco = await enderecoBusiness.buscarEnderecoPorId(enderecoId);
      
      if (endereco) {
        res.status(200).json(endereco);
      } else {
        res.status(404).send("Endereço não encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar endereço");
    }
  }

  // Rota PATCH /enderecos/:id - Atualiza os dados de um endereço
  async atualizarEndereco(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rua, numero, complemento, bairro, cidade, estado, cep, latitude, longitude } = req.body;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      if (estado && estado.length !== 2) {
        res.status(400).send("Estado deve ter 2 caracteres");
        return;
      }

      const enderecoId = parseInt(id);

      if (isNaN(enderecoId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const atualizado = await enderecoBusiness.atualizarEndereco(enderecoId, {
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        latitude,
        longitude,
      });
      
      if (atualizado) {
        res.status(200).send("Endereço atualizado com sucesso");
      } else {
        res.status(404).send("Endereço não encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao atualizar endereço");
    }
  }

  // Rota DELETE /enderecos/:id - Deleta um endereço
  async deletarEndereco(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const enderecoId = parseInt(id);

      if (isNaN(enderecoId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const deletado = await enderecoBusiness.deletarEndereco(enderecoId);
      
      if (deletado) {
        res.status(200).send("Endereço deletado com sucesso");
      } else {
        res.status(404).send("Endereço não encontrado");
      }
    } catch (error: any) {
      console.error(error);
      
      if (error.message === "Endereço não pode ser deletado pois está em uso") {
        res.status(409).send(error.message);
      } else {
        res.status(500).send("Erro ao deletar endereço");
      }
    }
  }
}

