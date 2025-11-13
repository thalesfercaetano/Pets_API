// Este arquivo contém a lógica de negócio relacionada a adoções
// Aqui fazemos as operações no banco de dados relacionadas a adoções

import db from "../db";
import { Adocao, AdocaoDetalhada } from "../models/Adocao";

export class AdocaoBusiness {
  // Cria uma nova solicitação de adoção
  async criarAdocao(adocao: Adocao) {
    const pet = await db("PETS").where({ id: adocao.pet_id }).first();
    
    if (!pet) {
      throw new Error("Pet não encontrado");
    }

    return await db("PROCESSO_ADOCAO").insert({
      pet_id: adocao.pet_id,
      usuario_id: adocao.usuario_id,
      instituicao_id: pet.instituicao_id,
      status: adocao.status || "pendente",
    });
  }

  // Atualiza o status de uma adoção (pendente, aprovada, recusada)
  async atualizarStatus(id: number, status: string) {
    return await db("PROCESSO_ADOCAO").where({ id }).update({ status });
  }

  // Lista todas as solicitações de adoção associadas a um usuário específico
  async listarAdocoesPorUsuario(usuarioId: number): Promise<{
    usuarioExiste: boolean;
    adocoes: AdocaoDetalhada[];
  }> {
    // Verifica se o usuário existe antes de buscar as solicitações
    const usuario = await db("USUARIOS").where({ id: usuarioId }).first();

    if (!usuario) {
      return {
        usuarioExiste: false,
        adocoes: [],
      };
    }

    // Busca as solicitações de adoção do usuário 
    const adocoesDb = await db("PROCESSO_ADOCAO as pa")
      .leftJoin("PETS as p", "pa.pet_id", "p.id")
      .leftJoin("INSTITUICOES as i", "pa.instituicao_id", "i.id")
      .where("pa.usuario_id", usuarioId)
      .orderBy("pa.data_solicitacao", "desc")
      .select(
        "pa.id",
        "pa.pet_id",
        "pa.status",
        "pa.data_solicitacao",
        "pa.instituicao_id",
        "p.nome as pet_nome",
        "p.especie as pet_especie",
        "i.nome as instituicao_nome"
      );
      // Formata dados
    const adocoes = adocoesDb.map<AdocaoDetalhada>((adocao) => ({
      id: adocao.id,
      petId: adocao.pet_id,
      petName: adocao.pet_nome ?? null,
      petSpecies: adocao.pet_especie ?? null,
      status: adocao.status,
      requestDate: adocao.data_solicitacao,
      institutionId: adocao.instituicao_id ?? null,
      institutionName: adocao.instituicao_nome ?? null,
    }));

    return {
      usuarioExiste: true,
      adocoes,
    };
  }
}
