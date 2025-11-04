// Este arquivo contém a lógica de negócio relacionada a adoções
// Aqui fazemos as operações no banco de dados relacionadas a adoções

import db from "../db";
import { Adocao } from "../models/Adocao";

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
}
