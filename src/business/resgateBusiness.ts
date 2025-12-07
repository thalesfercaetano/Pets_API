// Este arquivo contém a lógica de negócio relacionada a resgates

import db from "../db";
import { Resgate } from "../models/Resgate";

export class ResgateBusiness {
  // Cria um novo reporte de resgate no banco de dados
  async reportarResgate(resgate: Resgate) {
    // Correção: Adicionado .returning('id') e tratamento do retorno
    const [retornoInsert] = await db("REPORTES_RESGATE").insert({
      descricao_local: resgate.localizacao || resgate.descricao,
      condicao_animal: resgate.status || "desconhecida",
    }).returning("id");

    const id = typeof retornoInsert === 'object' ? retornoInsert.id : retornoInsert;

    // Retorna o ID do reporte que acabou de ser criado
    return id;
  }
}