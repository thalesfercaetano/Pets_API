// Este arquivo é o Controller de Resgates

import { Request, Response } from "express";
import { ResgateBusiness } from "../business/resgateBusiness";

// Cria uma instância da classe de negócio para usar nos métodos
const resgateBusiness = new ResgateBusiness();

export class ResgateController {
  // Rota POST /resgates/reportar - Cria um novo reporte de resgate
  async reportarResgate(req: Request, res: Response) {
    try {
      const { descricao, localizacao } = req.body;

      if (!descricao || !localizacao) {
        return res.status(400).send({ error: "Informe descrição e localização." });
      }

      await resgateBusiness.reportarResgate({ descricao, localizacao });
      
      res.status(201).send({ message: "Resgate reportado com sucesso!" });
    } catch (error) {
      res.status(500).send({ error: "Erro ao reportar resgate." });
    }
  }
}
