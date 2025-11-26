// Este arquivo contém a lógica de negócio relacionada ao sistema de matches estilo Tinder

import db from "../db";
import { Swipe, Match, MatchDetalhado, PetPerfil, UsuarioPerfil, SwipeResponse } from "../models/Match";

export class MatchBusiness {
  async descobrirPets(usuarioId: number, limite: number = 10): Promise<PetPerfil[]> {
    const petsVistos = await db("SWIPES")
      .where({ usuario_id: usuarioId })
      .select("pet_id");

    const idsPetsVistos = petsVistos.map((s: any) => s.pet_id);

    const petsDisponiveis = await db("PETS as p")
      .leftJoin("INSTITUICOES as i", "p.instituicao_id", "i.id")
      .where("p.status_adocao", "disponível")
      .where("p.ativo", true)
      .whereNotIn("p.id", idsPetsVistos.length > 0 ? idsPetsVistos : [0])
      .whereNotExists(function() {
        this.select("*")
          .from("MATCHES as m")
          .whereRaw("m.pet_id = p.id")
          .where("m.status", "ativo")
          .where("m.usuario_id", usuarioId);
      })
      .orderByRaw("RANDOM()")
      .limit(limite)
      .select(
        "p.id",
        "p.nome",
        "p.especie",
        "p.raca",
        "p.sexo",
        "p.idade_aproximada",
        "p.porte",
        "p.cor",
        "p.vacinado",
        "p.castrado",
        "p.descricao_saude",
        "p.historia",
        "p.instituicao_id",
        "i.nome as instituicao_nome",
        "p.data_cadastro"
      );

    return petsDisponiveis.map((pet: any) => ({
      id: pet.id,
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      sexo: pet.sexo,
      idade_aproximada: pet.idade_aproximada,
      porte: pet.porte,
      cor: pet.cor,
      vacinado: pet.vacinado,
      castrado: pet.castrado,
      descricao_saude: pet.descricao_saude,
      historia: pet.historia,
      instituicao_id: pet.instituicao_id,
      instituicao_nome: pet.instituicao_nome,
      data_cadastro: pet.data_cadastro,
    }));
  }

  async descobrirUsuarios(instituicaoId: number, petId: number, limite: number = 10): Promise<UsuarioPerfil[]> {
    const pet = await db("PETS").where({ id: petId, instituicao_id: instituicaoId }).first();
    if (!pet) {
      return [];
    }

    const usuariosComLike = await db("SWIPES as s")
      .where("s.pet_id", petId)
      .where("s.tipo", "like")
      .whereNotNull("s.usuario_id")
      .whereNotExists(function() {
        this.select("*")
          .from("MATCHES as m")
          .whereRaw("m.usuario_id = s.usuario_id")
          .whereRaw("m.pet_id = s.pet_id")
          .where("m.status", "ativo");
      })
      .select("s.usuario_id")
      .distinct();

    const idsUsuarios = usuariosComLike.map((u: any) => u.usuario_id);

    if (idsUsuarios.length === 0) {
      return [];
    }

    const usuarios = await db("USUARIOS as u")
      .leftJoin("PROCESSO_ADOCAO as pa", function() {
        this.on("pa.usuario_id", "=", "u.id")
          .andOn("pa.status", "=", db.raw("'aprovada'"));
      })
      .whereIn("u.id", idsUsuarios)
      .where("u.ativo", true)
      .groupBy("u.id", "u.nome", "u.email", "u.telefone", "u.data_cadastro")
      .orderByRaw("RANDOM()")
      .limit(limite)
      .select(
        "u.id",
        "u.nome",
        "u.email",
        "u.telefone",
        "u.data_cadastro",
        db.raw("COUNT(pa.id) as total_adocoes")
      );

    return usuarios.map((usuario: any) => ({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      data_cadastro: usuario.data_cadastro,
      total_adocoes: parseInt(usuario.total_adocoes) || 0,
    }));
  }

  async swipeUsuario(usuarioId: number, petId: number, tipo: "like" | "pass"): Promise<SwipeResponse> {
    const pet = await db("PETS").where({ id: petId }).first();
    if (!pet) {
      throw new Error("Pet não encontrado");
    }

    if (pet.status_adocao !== "disponível" || !pet.ativo) {
      throw new Error("Pet não está disponível para adoção");
    }

    const swipeExistente = await db("SWIPES")
      .where({ usuario_id: usuarioId, pet_id: petId })
      .first();

    if (swipeExistente) {
      throw new Error("Você já avaliou este pet");
    }

    await db("SWIPES").insert({
      usuario_id: usuarioId,
      pet_id: petId,
      tipo: tipo,
    });

    if (tipo === "like") {
      const likeInstituicao = await db("SWIPES")
        .where({
          instituicao_id: pet.instituicao_id,
          pet_id: petId,
          tipo: "like",
        })
        .whereNotNull("instituicao_id")
        .first();

      if (likeInstituicao) {
        const [matchId] = await db("MATCHES").insert({
          usuario_id: usuarioId,
          instituicao_id: pet.instituicao_id,
          pet_id: petId,
          status: "ativo",
        });

        if (!matchId) {
          throw new Error("Erro ao criar match");
        }

        return {
          match: true,
          match_id: matchId,
          message: "🎉 Match! Vocês deram like um no outro!",
        };
      }
    }

    return {
      match: false,
      message: tipo === "like" ? "Like registrado! Aguardando match..." : "Pass registrado",
    };
  }

  async swipeInstituicao(instituicaoId: number, usuarioId: number, petId: number, tipo: "like" | "pass"): Promise<SwipeResponse> {
    const pet = await db("PETS").where({ id: petId, instituicao_id: instituicaoId }).first();
    if (!pet) {
      throw new Error("Pet não encontrado ou não pertence a esta instituição");
    }

    const swipeExistente = await db("SWIPES")
      .where({ instituicao_id: instituicaoId, pet_id: petId })
      .whereNotNull("instituicao_id")
      .first();

    if (swipeExistente) {
      throw new Error("Você já avaliou este usuário para este pet");
    }

    await db("SWIPES").insert({
      instituicao_id: instituicaoId,
      pet_id: petId,
      tipo: tipo,
    });

    if (tipo === "like") {
      const likeUsuario = await db("SWIPES")
        .where({
          usuario_id: usuarioId,
          pet_id: petId,
          tipo: "like",
        })
        .whereNotNull("usuario_id")
        .first();

      if (likeUsuario) {
        const [matchId] = await db("MATCHES").insert({
          usuario_id: usuarioId,
          instituicao_id: instituicaoId,
          pet_id: petId,
          status: "ativo",
        });

        if (!matchId) {
          throw new Error("Erro ao criar match");
        }

        return {
          match: true,
          match_id: matchId,
          message: "🎉 Match! Vocês deram like um no outro!",
        };
      }
    }

    return {
      match: false,
      message: tipo === "like" ? "Like registrado! Aguardando match..." : "Pass registrado",
    };
  }

  async listarMatchesUsuario(usuarioId: number): Promise<MatchDetalhado[]> {
    const matches = await db("MATCHES as m")
      .leftJoin("USUARIOS as u", "m.usuario_id", "u.id")
      .leftJoin("INSTITUICOES as i", "m.instituicao_id", "i.id")
      .leftJoin("PETS as p", "m.pet_id", "p.id")
      .where("m.usuario_id", usuarioId)
      .where("m.status", "ativo")
      .orderBy("m.ultima_interacao", "desc")
      .select(
        "m.id",
        "m.usuario_id",
        "u.nome as usuario_nome",
        "u.email as usuario_email",
        "m.instituicao_id",
        "i.nome as instituicao_nome",
        "m.pet_id",
        "p.nome as pet_nome",
        "p.especie as pet_especie",
        "p.raca as pet_raca",
        "p.cor as pet_cor",
        "m.status",
        "m.data_match",
        "m.ultima_interacao"
      );

    return matches.map((match: any) => ({
      id: match.id,
      usuario_id: match.usuario_id,
      usuario_nome: match.usuario_nome,
      usuario_email: match.usuario_email,
      instituicao_id: match.instituicao_id,
      instituicao_nome: match.instituicao_nome,
      pet_id: match.pet_id,
      pet_nome: match.pet_nome,
      pet_especie: match.pet_especie,
      pet_raca: match.pet_raca,
      pet_cor: match.pet_cor,
      status: match.status,
      data_match: match.data_match,
      ultima_interacao: match.ultima_interacao,
    }));
  }

  async listarMatchesInstituicao(instituicaoId: number): Promise<MatchDetalhado[]> {
    const matches = await db("MATCHES as m")
      .leftJoin("USUARIOS as u", "m.usuario_id", "u.id")
      .leftJoin("INSTITUICOES as i", "m.instituicao_id", "i.id")
      .leftJoin("PETS as p", "m.pet_id", "p.id")
      .where("m.instituicao_id", instituicaoId)
      .where("m.status", "ativo")
      .orderBy("m.ultima_interacao", "desc")
      .select(
        "m.id",
        "m.usuario_id",
        "u.nome as usuario_nome",
        "u.email as usuario_email",
        "m.instituicao_id",
        "i.nome as instituicao_nome",
        "m.pet_id",
        "p.nome as pet_nome",
        "p.especie as pet_especie",
        "p.raca as pet_raca",
        "p.cor as pet_cor",
        "m.status",
        "m.data_match",
        "m.ultima_interacao"
      );

    return matches.map((match: any) => ({
      id: match.id,
      usuario_id: match.usuario_id,
      usuario_nome: match.usuario_nome,
      usuario_email: match.usuario_email,
      instituicao_id: match.instituicao_id,
      instituicao_nome: match.instituicao_nome,
      pet_id: match.pet_id,
      pet_nome: match.pet_nome,
      pet_especie: match.pet_especie,
      pet_raca: match.pet_raca,
      pet_cor: match.pet_cor,
      status: match.status,
      data_match: match.data_match,
      ultima_interacao: match.ultima_interacao,
    }));
  }

  async buscarMatchPorId(matchId: number, usuarioId?: number, instituicaoId?: number): Promise<MatchDetalhado | null> {
    let query = db("MATCHES as m")
      .leftJoin("USUARIOS as u", "m.usuario_id", "u.id")
      .leftJoin("INSTITUICOES as i", "m.instituicao_id", "i.id")
      .leftJoin("PETS as p", "m.pet_id", "p.id")
      .where("m.id", matchId);

    if (usuarioId) {
      query = query.where("m.usuario_id", usuarioId);
    }
    if (instituicaoId) {
      query = query.where("m.instituicao_id", instituicaoId);
    }

    const match = await query
      .select(
        "m.id",
        "m.usuario_id",
        "u.nome as usuario_nome",
        "u.email as usuario_email",
        "m.instituicao_id",
        "i.nome as instituicao_nome",
        "m.pet_id",
        "p.nome as pet_nome",
        "p.especie as pet_especie",
        "p.raca as pet_raca",
        "p.cor as pet_cor",
        "m.status",
        "m.data_match",
        "m.ultima_interacao"
      )
      .first();

    if (!match) {
      return null;
    }

    return {
      id: match.id,
      usuario_id: match.usuario_id,
      usuario_nome: match.usuario_nome,
      usuario_email: match.usuario_email,
      instituicao_id: match.instituicao_id,
      instituicao_nome: match.instituicao_nome,
      pet_id: match.pet_id,
      pet_nome: match.pet_nome,
      pet_especie: match.pet_especie,
      pet_raca: match.pet_raca,
      pet_cor: match.pet_cor,
      status: match.status,
      data_match: match.data_match,
      ultima_interacao: match.ultima_interacao,
    };
  }

  async atualizarStatusMatch(matchId: number, novoStatus: string, usuarioId?: number, instituicaoId?: number): Promise<boolean> {
    let query = db("MATCHES").where({ id: matchId });

    if (usuarioId) {
      query = query.where({ usuario_id: usuarioId });
    }
    if (instituicaoId) {
      query = query.where({ instituicao_id: instituicaoId });
    }

    const updated = await query.update({
      status: novoStatus,
      ultima_interacao: db.fn.now(),
    });

    return updated > 0;
  }
}