// Este arquivo contém a lógica de negócio relacionada a resgates
// Aqui fazemos as operações no banco de dados relacionadas a reportes de animais que precisam ser resgatados

import db from "../db";
import { Resgate } from "../models/Resgate";

export class ResgateBusiness {
  // Cria um novo reporte de resgate no banco de dados
  async reportarResgate(resgate: Resgate) {
    const [id] = await db("REPORTES_RESGATE").insert({
      descricao_local: resgate.localizacao || resgate.descricao,
      condicao_animal: resgate.status || "desconhecida",
    });

    // Retorna o ID do reporte que acabou de ser criado
    return id;
  }
}
