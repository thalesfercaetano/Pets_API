// Este arquivo contém a lógica de negócio relacionada a instituições
// Aqui fazemos todas as operações no banco de dados relacionadas a instituições

import db from "../db";
import { Instituicao, InstituicaoResponse } from "../models/Instituicao";

export class InstituicaoBusiness {
  // Busca todas as instituições cadastradas no banco de dados
  async listarInstituicoes(): Promise<InstituicaoResponse[]> {
    const instituicoes = await db("INSTITUICOES").select("*");
    
    return instituicoes.map(instituicao => ({
      id: instituicao.id,
      nome: instituicao.nome,
      cnpj: instituicao.cnpj,
      email: instituicao.email,
      telefone: instituicao.telefone,
      link_site: instituicao.link_site,
      descricao: instituicao.descricao,
      endereco_id: instituicao.endereco_id,
      data_cadastro: instituicao.data_cadastro,
    }));
  }

  // Cria uma nova instituição no banco de dados
  async criarInstituicao(instituicao: Instituicao): Promise<InstituicaoResponse> {
    const { nome, email, cnpj, telefone, link_site, descricao, endereco_id } = instituicao;

    // Verifica se o email já está cadastrado
    const instituicaoExistente = await db("INSTITUICOES").where({ email }).first();
    
    if (instituicaoExistente) {
      throw new Error("Email já cadastrado");
    }

    // Verifica se o CNPJ já está cadastrado (se fornecido)
    if (cnpj) {
      const cnpjExistente = await db("INSTITUICOES").where({ cnpj }).first();
      
      if (cnpjExistente) {
        throw new Error("CNPJ já cadastrado");
      }
    }

    const [instituicaoCriada] = await db("INSTITUICOES")
      .insert({
        nome,
        email,
        cnpj: cnpj || null,
        telefone: telefone || null,
        link_site: link_site || null,
        descricao: descricao || null,
        endereco_id: endereco_id || null,
      })
      .returning("*");

    if (!instituicaoCriada) {
      throw new Error("Erro ao criar instituição: dados não retornados");
    }

    return {
      id: instituicaoCriada.id,
      nome: instituicaoCriada.nome,
      cnpj: instituicaoCriada.cnpj,
      email: instituicaoCriada.email,
      telefone: instituicaoCriada.telefone,
      link_site: instituicaoCriada.link_site,
      descricao: instituicaoCriada.descricao,
      endereco_id: instituicaoCriada.endereco_id,
      data_cadastro: instituicaoCriada.data_cadastro,
    };
  }

  // Busca uma instituição específica pelo seu ID
  async buscarInstituicaoPorId(id: number): Promise<InstituicaoResponse | null> {
    const instituicao = await db("INSTITUICOES").where({ id }).first();
    
    if (!instituicao) {
      return null;
    }

    return {
      id: instituicao.id,
      nome: instituicao.nome,
      cnpj: instituicao.cnpj,
      email: instituicao.email,
      telefone: instituicao.telefone,
      link_site: instituicao.link_site,
      descricao: instituicao.descricao,
      endereco_id: instituicao.endereco_id,
      data_cadastro: instituicao.data_cadastro,
    };
  }

  // Atualiza os dados de uma instituição existente
  async atualizarInstituicao(
    id: number,
    dadosAtualizacao: {
      nome?: string;
      email?: string;
      cnpj?: string;
      telefone?: string;
      link_site?: string;
      descricao?: string;
      endereco_id?: number;
    }
  ): Promise<boolean> {
    const updateData: any = {};
    
    if (dadosAtualizacao.nome) {
      updateData.nome = dadosAtualizacao.nome;
    }
    
    if (dadosAtualizacao.email) {
      const instituicaoExistente = await db("INSTITUICOES")
        .where({ email: dadosAtualizacao.email })
        .whereNot({ id })
        .first();
      
      if (instituicaoExistente) {
        throw new Error("Email já está em uso por outra instituição");
      }
      
      updateData.email = dadosAtualizacao.email;
    }

    if (dadosAtualizacao.cnpj !== undefined) {
      if (dadosAtualizacao.cnpj) {
        const cnpjExistente = await db("INSTITUICOES")
          .where({ cnpj: dadosAtualizacao.cnpj })
          .whereNot({ id })
          .first();
        
        if (cnpjExistente) {
          throw new Error("CNPJ já está em uso por outra instituição");
        }
      }
      updateData.cnpj = dadosAtualizacao.cnpj || null;
    }
    
    if (dadosAtualizacao.telefone !== undefined) {
      updateData.telefone = dadosAtualizacao.telefone || null;
    }
    
    if (dadosAtualizacao.link_site !== undefined) {
      updateData.link_site = dadosAtualizacao.link_site || null;
    }
    
    if (dadosAtualizacao.descricao !== undefined) {
      updateData.descricao = dadosAtualizacao.descricao || null;
    }
    
    if (dadosAtualizacao.endereco_id !== undefined) {
      updateData.endereco_id = dadosAtualizacao.endereco_id || null;
    }

    if (Object.keys(updateData).length === 0) {
      return false;
    }

    const updatedRows = await db("INSTITUICOES")
      .where({ id })
      .update(updateData);

    return updatedRows > 0;
  }

  // Deleta uma instituição do banco de dados
  async deletarInstituicao(id: number): Promise<boolean> {
    const deletedRows = await db("INSTITUICOES").where({ id }).del();
    
    return deletedRows > 0;
  }
}

