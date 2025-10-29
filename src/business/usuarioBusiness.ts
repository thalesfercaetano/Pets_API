import db from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario, UsuarioLogin, UsuarioResponse } from "../models/Usuario";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class UsuarioBusiness {
  async criarUsuario(usuario: Usuario): Promise<UsuarioResponse> {
    const { name, email, password } = usuario;
    console.log("chegou no business");

    const usuarioExistente = await db("USUARIOS").where({ email }).first();
    if (usuarioExistente) {
      throw new Error("Email já cadastrado");
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const [id] = await db("USUARIOS").insert({
      nome: name,
      email,
      senha_hash: senhaHash,
    });

    return { id: id!, name, email };
  }

  async login(usuarioLogin: UsuarioLogin): Promise<{ token: string; user: UsuarioResponse }> {
    const { email, password } = usuarioLogin;

    const usuario = await db("USUARIOS").where({ email }).first();
    if (!usuario) {
      throw new Error("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha_hash);
    if (!senhaValida) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const user: UsuarioResponse = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
    };

    return { token, user };
  }

  async buscarUsuarioPorId(id: number): Promise<UsuarioResponse | null> {
    const usuario = await db("USUARIOS").where({ id }).first();
    
    if (!usuario) {
      return null;
    }

    return {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
    };
  }

  async atualizarUsuario(id: number, dadosAtualizacao: { name?: string; email?: string }): Promise<boolean> {
    const updateData: any = {};
    
    if (dadosAtualizacao.name) {
      updateData.nome = dadosAtualizacao.name;
    }
    
    if (dadosAtualizacao.email) {
      const usuarioExistente = await db("USUARIOS")
        .where({ email: dadosAtualizacao.email })
        .whereNot({ id })
        .first();
      
      if (usuarioExistente) {
        throw new Error("Email já está em uso por outro usuário");
      }
      
      updateData.email = dadosAtualizacao.email;
    }

    if (Object.keys(updateData).length === 0) {
      return false;
    }

    const updatedRows = await db("USUARIOS")
      .where({ id })
      .update(updateData);

    return updatedRows > 0;
  }

  async deletarUsuario(id: number): Promise<boolean> {
    const deletedRows = await db("USUARIOS").where({ id }).del();
    return deletedRows > 0;
  }
}

