// Este arquivo contém a lógica de negócio relacionada a endereços
// Aqui fazemos todas as operações no banco de dados relacionadas a endereços

import db from "../db";
import { Endereco, EnderecoResponse } from "../models/Endereco";

export class EnderecoBusiness {
  // Busca todos os endereços cadastrados no banco de dados
  async listarEnderecos(): Promise<EnderecoResponse[]> {
    const enderecos = await db("ENDERECOS").select("*");
    
    return enderecos.map(endereco => ({
      id: endereco.id,
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
    }));
  }

  // Cria um novo endereço no banco de dados
  async criarEndereco(endereco: Endereco): Promise<EnderecoResponse> {
    const { rua, numero, complemento, bairro, cidade, estado, cep, latitude, longitude } = endereco;

    const [id] = await db("ENDERECOS").insert({
      rua,
      numero: numero || null,
      complemento: complemento || null,
      bairro,
      cidade,
      estado,
      cep: cep || null,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    if (!id) {
      throw new Error("Erro ao criar endereço: ID não retornado");
    }

    const enderecoCriado = await db("ENDERECOS").where({ id }).first();

    if (!enderecoCriado) {
      throw new Error("Erro ao buscar endereço criado");
    }

    return {
      id: enderecoCriado.id,
      rua: enderecoCriado.rua,
      numero: enderecoCriado.numero,
      complemento: enderecoCriado.complemento,
      bairro: enderecoCriado.bairro,
      cidade: enderecoCriado.cidade,
      estado: enderecoCriado.estado,
      cep: enderecoCriado.cep,
    };
  }

  // Busca um endereço específico pelo seu ID
  async buscarEnderecoPorId(id: number): Promise<EnderecoResponse | null> {
    const endereco = await db("ENDERECOS").where({ id }).first();
    
    if (!endereco) {
      return null;
    }

    return {
      id: endereco.id,
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
    };
  }

  // Atualiza os dados de um endereço existente
  async atualizarEndereco(
    id: number,
    dadosAtualizacao: {
      rua?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      cidade?: string;
      estado?: string;
      cep?: string;
      latitude?: number;
      longitude?: number;
    }
  ): Promise<boolean> {
    const updateData: any = {};
    
    if (dadosAtualizacao.rua) {
      updateData.rua = dadosAtualizacao.rua;
    }
    
    if (dadosAtualizacao.numero !== undefined) {
      updateData.numero = dadosAtualizacao.numero || null;
    }
    
    if (dadosAtualizacao.complemento !== undefined) {
      updateData.complemento = dadosAtualizacao.complemento || null;
    }
    
    if (dadosAtualizacao.bairro) {
      updateData.bairro = dadosAtualizacao.bairro;
    }
    
    if (dadosAtualizacao.cidade) {
      updateData.cidade = dadosAtualizacao.cidade;
    }
    
    if (dadosAtualizacao.estado) {
      updateData.estado = dadosAtualizacao.estado;
    }
    
    if (dadosAtualizacao.cep !== undefined) {
      updateData.cep = dadosAtualizacao.cep || null;
    }

    if (Object.keys(updateData).length === 0) {
      return false;
    }

    const updatedRows = await db("ENDERECOS")
      .where({ id })
      .update(updateData);

    return updatedRows > 0;
  }

  // Deleta um endereço do banco de dados
  async deletarEndereco(id: number): Promise<boolean> {
    // Verifica se o endereço está sendo usado por usuários ou instituições
    const usuarioComEndereco = await db("USUARIOS").where({ endereco_id: id }).first();
    const instituicaoComEndereco = await db("INSTITUICOES").where({ endereco_id: id }).first();
    
    if (usuarioComEndereco || instituicaoComEndereco) {
      throw new Error("Endereço não pode ser deletado pois está em uso");
    }

    const deletedRows = await db("ENDERECOS").where({ id }).del();
    
    return deletedRows > 0;
  }
}

