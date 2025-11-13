// Este arquivo contém a lógica de negócio relacionada a doações
// Aqui validamos os dados e interagimos com o banco para registrar doações

import db from "../db";
import { Doacao, DoacaoResponse } from "../models/Doacao";

export class DoacaoBusiness {
  // Registra uma nova doação de item no banco de dados
  async registrarDoacao(doacao: Doacao): Promise<DoacaoResponse> {
    const { usuario_id, instituicao_id, tipo_doacao_id, quantidade, status_entrega } = doacao;

    // Verifica se o usuário informado existe
    const usuario = await db("USUARIOS").where({ id: usuario_id }).first();

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se a instituição existe
    const instituicao = await db("INSTITUICOES").where({ id: instituicao_id }).first();

    if (!instituicao) {
      throw new Error("Instituição não encontrada");
    }

    // Verifica se o tipo de doação é válido
    const tipoDoacao = await db("TIPOS_DOACAO").where({ id: tipo_doacao_id }).first();

    if (!tipoDoacao) {
      throw new Error("Tipo de doação não encontrado");
    }

    // Insere a doação na tabela DOACOES
    const [registroId] = await db("DOACOES")
      .insert({
        usuario_id,
        instituicao_id,
        tipo_doacao_id,
        quantidade,
        status_entrega: status_entrega || "pendente",
      })
      .returning("id");

    // Garante compatibilidade com diferentes versões do Knex/Postgres,
    // que podem retornar um objeto { id } ou apenas o número
    const novoId =
      registroId && typeof registroId === "object" && "id" in registroId
        ? Number((registroId as { id: number }).id)
        : Number(registroId);

    // Busca o registro completo para retornar os dados principais
    const registro = await db("DOACOES").where({ id: novoId }).first();

    return {
      id: registro.id,
      usuarioId: registro.usuario_id,
      instituicaoId: registro.instituicao_id,
      tipoDoacaoId: registro.tipo_doacao_id,
      quantidade: Number(registro.quantidade),
      dataDoacao: registro.data_doacao,
      statusEntrega: registro.status_entrega,
    };
  }
}

