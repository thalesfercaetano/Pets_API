// Este arquivo contém a lógica de negócio relacionada a endereços

import db from "../db";
import { Endereco, EnderecoResponse } from "../models/Endereco";

export class EnderecoBusiness {
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
      latitude: endereco.latitude,
      longitude: endereco.longitude,
    }));
  }

  async criarEndereco(endereco: Endereco): Promise<EnderecoResponse> {
    const { rua, numero, complemento, bairro, cidade, estado, cep, latitude, longitude } = endereco;

    // Correção: Adicionado .returning('id')
    const [retornoInsert] = await db("ENDERECOS").insert({
      rua,
      numero: numero || null,
      complemento: complemento || null,
      bairro,
      cidade,
      estado,
      cep: cep || null,
      latitude: latitude || null,
      longitude: longitude || null,
    }).returning("id");

    if (!retornoInsert) throw new Error("Erro ao criar endereço: ID não retornado");

    // Extração segura do ID
    const id = typeof retornoInsert === 'object' ? retornoInsert.id : retornoInsert;

    const enderecoCriado = await db("ENDERECOS").where({ id }).first();

    if (!enderecoCriado) throw new Error("Erro ao buscar endereço criado");

    return {
      id: enderecoCriado.id,
      rua: enderecoCriado.rua,
      numero: enderecoCriado.numero,
      complemento: enderecoCriado.complemento,
      bairro: enderecoCriado.bairro,
      cidade: enderecoCriado.cidade,
      estado: enderecoCriado.estado,
      cep: enderecoCriado.cep,
      latitude: enderecoCriado.latitude,
      longitude: enderecoCriado.longitude,
    };
  }

  async buscarEnderecoPorId(id: number): Promise<EnderecoResponse | null> {
    const endereco = await db("ENDERECOS").where({ id }).first();
    
    if (!endereco) return null;

    return {
      id: endereco.id,
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
      latitude: endereco.latitude,
      longitude: endereco.longitude,
    };
  }

  async atualizarEndereco(id: number, dadosAtualizacao: any): Promise<boolean> {
    const updateData: any = {};
    if (dadosAtualizacao.rua) updateData.rua = dadosAtualizacao.rua;
    if (dadosAtualizacao.numero !== undefined) updateData.numero = dadosAtualizacao.numero || null;
    if (dadosAtualizacao.complemento !== undefined) updateData.complemento = dadosAtualizacao.complemento || null;
    if (dadosAtualizacao.bairro) updateData.bairro = dadosAtualizacao.bairro;
    if (dadosAtualizacao.cidade) updateData.cidade = dadosAtualizacao.cidade;
    if (dadosAtualizacao.estado) updateData.estado = dadosAtualizacao.estado;
    if (dadosAtualizacao.cep !== undefined) updateData.cep = dadosAtualizacao.cep || null;
    if (dadosAtualizacao.latitude !== undefined) updateData.latitude = dadosAtualizacao.latitude || null;
    if (dadosAtualizacao.longitude !== undefined) updateData.longitude = dadosAtualizacao.longitude || null;

    if (Object.keys(updateData).length === 0) return false;

    const updatedRows = await db("ENDERECOS").where({ id }).update(updateData);
    return updatedRows > 0;
  }

  async deletarEndereco(id: number): Promise<boolean> {
    const usuarioComEndereco = await db("USUARIOS").where({ endereco_id: id }).first();
    const instituicaoComEndereco = await db("INSTITUICOES").where({ endereco_id: id }).first();
    
    if (usuarioComEndereco || instituicaoComEndereco) {
      throw new Error("Endereço não pode ser deletado pois está em uso");
    }

    const deletedRows = await db("ENDERECOS").where({ id }).del();
    return deletedRows > 0;
  }
}