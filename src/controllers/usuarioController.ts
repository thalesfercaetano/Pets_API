import { Request, Response } from "express";
import { UsuarioBusiness } from "../business/usuarioBusiness";

const usuarioBusiness = new UsuarioBusiness();

export class UsuarioController {
  async criarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      console.log("criando usuário");

      if (!name || !email || !password) {
        res.status(400).send("Nome, email e senha são obrigatórios");
        return;
      }
      console.log("antes do business");
      const novoUsuario = await usuarioBusiness.criarUsuario({ name, email, password });
      res.status(201).json(novoUsuario);


    } catch (error: any) {
      console.error(error);
      if (error.message === "Email já cadastrado") {
        res.status(409).send(error.message);
      } else {
        res.status(500).send("Erro ao criar usuário");
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).send("Email e senha são obrigatórios");
        return;
      }

      const result = await usuarioBusiness.login({ email, password });
      res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      if (error.message === "Credenciais inválidas") {
        res.status(401).send(error.message);
      } else {
        res.status(500).send("Erro ao fazer login");
      }
    }
  }

  async buscarUsuarioPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuarioId = parseInt(id!);

      if (isNaN(usuarioId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const usuario = await usuarioBusiness.buscarUsuarioPorId(usuarioId);
      
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).send("Usuário não encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar usuário");
    }
  }

  async atualizarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const usuarioId = parseInt(id!);

      if (isNaN(usuarioId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const atualizado = await usuarioBusiness.atualizarUsuario(usuarioId, { name, email });
      
      if (atualizado) {
        res.status(200).send("Usuário atualizado com sucesso");
      } else {
        res.status(404).send("Usuário não encontrado");
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === "Email já está em uso por outro usuário") {
        res.status(409).send(error.message);
      } else {
        res.status(500).send("Erro ao atualizar usuário");
      }
    }
  }

  async deletarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuarioId = parseInt(id!);

      if (isNaN(usuarioId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const deletado = await usuarioBusiness.deletarUsuario(usuarioId);
      
      if (deletado) {
        res.status(200).send("Usuário deletado com sucesso");
      } else {
        res.status(404).send("Usuário não encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao deletar usuário");
    }
  }
}

