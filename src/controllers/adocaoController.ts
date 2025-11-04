// Este arquivo é o Controller de Adoções
// Os Controllers são responsáveis por receber as requisições HTTP e enviar as respostas

import { Request, Response } from "express";
import { AdocaoBusiness } from "../business/adocaoBusiness";

// Cria uma instância da classe de negócio para usar nos métodos
const adocaoBusiness = new AdocaoBusiness();

export class AdocaoController {
  // Rota POST /adocoes - Cria uma nova solicitação de adoção
  async criarAdocao(req: Request, res: Response) {
    try {
      const { usuario_id, pet_id } = req.body;

      if (!usuario_id || !pet_id) {
        return res.status(400).send({ error: "Informe usuário e pet." });
      }

      await adocaoBusiness.criarAdocao({ usuario_id, pet_id });
      
      res.status(201).send({ message: "Solicitação de adoção registrada!" });
    } catch (error) {
      res.status(500).send({ error: "Erro ao registrar adoção." });
    }
  }

  // Rota PATCH /adocoes/:id/status - Atualiza o status de uma adoção
  async atualizarStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validos = ["pendente", "aprovada", "recusada"];
      
      if (!validos.includes(status)) {
        return res.status(400).send({ error: "Status inválido." });
      }

      const result = await adocaoBusiness.atualizarStatus(Number(id), status);
      
      if (!result) return res.status(404).send({ error: "Adoção não encontrada." });

      res.send({ message: "Status atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao atualizar status." });
    }
  }
}
