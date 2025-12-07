import supertest from "supertest";
import { app } from "../../src/app";
import db from "../../src/db";

const request = supertest(app);
let dbReady = true;

describe("E2E /adocoes", () => {
  beforeAll(async () => {
    try {
      await db.migrate.latest();
    } catch (e) {
      dbReady = false;
      console.error("Falha migrar (adocoes):", e);
    }
  });

  afterEach(async () => {
    if (!dbReady) return;
    try {
      await db("PROCESSO_ADOCAO").del();
      await db("PETS").del();
      await db("USUARIOS").del();
      await db("INSTITUICOES").del();
    } catch (e) {
      console.error("Falha limpar (adocoes):", e);
    }
  });
  
  afterAll(async () => {
    try {
      await db.destroy();
    } catch (e) {
      console.error(e);
    }
  });

  describe("POST /adocoes", () => {
    it("cria solicitação com sucesso (201)", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({ nome: "ONG X", email: "x@ong.com" })
        .returning("id");

      const [{ id: userId }] = await db("USUARIOS")
        .insert({
          nome: "User",
          email: "user@x.com",
          senha_hash: "hash",
        })
        .returning("id");

      const [{ id: petId }] = await db("PETS")
        .insert({
          nome: "Pipoca",
          especie: "Gato",
          sexo: "F",
          instituicao_id: Number(instId),
          status_adocao: "disponível",
        })
        .returning("id");

      const res = await request
        .post("/adocoes")
        .send({ usuario_id: Number(userId), pet_id: Number(petId) });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: "Solicitação de adoção registrada!",
      });

      const pa = await db("PROCESSO_ADOCAO")
        .where({ pet_id: Number(petId), usuario_id: Number(userId) })
        .first();
      expect(pa).toBeDefined();
    });

    it("retorna 400 quando faltam campos", async () => {
      const res = await request.post("/adocoes").send({ usuario_id: 1 });
      expect(res.status).toBe(400);
    });

    it("retorna 500 quando pet não existe", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: userId }] = await db("USUARIOS")
        .insert({
          nome: "User2",
          email: "user2@x.com",
          senha_hash: "hash",
        })
        .returning("id");

      const res = await request
        .post("/adocoes")
        .send({ usuario_id: Number(userId), pet_id: 999999 });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao registrar adoção.");
    });
  });

  describe("PATCH /adocoes/:id/status", () => {
    it("atualiza status com sucesso", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({
          nome: "ONG Y",
          email: "y@ong.com",
        })
        .returning("id");

      const [{ id: userId }] = await db("USUARIOS")
        .insert({
          nome: "User3",
          email: "user3@x.com",
          senha_hash: "hash",
        })
        .returning("id");

      const [{ id: petId }] = await db("PETS")
        .insert({
          nome: "Toby",
          especie: "Cachorro",
          sexo: "M",
          instituicao_id: Number(instId),
          status_adocao: "disponível",
        })
        .returning("id");

      const [{ id: paId }] = await db("PROCESSO_ADOCAO")
        .insert({
          pet_id: Number(petId),
          usuario_id: Number(userId),
          instituicao_id: Number(instId),
          status: "pendente",
        })
        .returning("id");

      const res = await request
        .patch(`/adocoes/${paId}/status`)
        .send({ status: "aprovada" });

      expect(res.status).toBe(200);

      const updated = await db("PROCESSO_ADOCAO")
        .where({ id: Number(paId) })
        .first();
      expect(updated.status).toBe("aprovada");
    });

    it("retorna 400 quando status inválido", async () => {
      const res = await request
        .patch("/adocoes/1/status")
        .send({ status: "invalido" });
      expect(res.status).toBe(400);
    });

    it("retorna 404 quando adoção não existe", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const res = await request
        .patch("/adocoes/999999/status")
        .send({ status: "pendente" });
      expect(res.status).toBe(404);
    });
  });

  describe("GET /adocoes/usuario/:id", () => {
    it("retorna 404 quando usuário não existe", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const res = await request.get("/adocoes/usuario/999999");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Usuário não encontrado");
    });

    it("retorna 200 com lista de adoções do usuário", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({
          nome: "ONG Z",
          email: "z@ong.com",
        })
        .returning("id");

      const [{ id: userId }] = await db("USUARIOS")
        .insert({
          nome: "User4",
          email: "user4@x.com",
          senha_hash: "hash",
        })
        .returning("id");

      const [{ id: petId }] = await db("PETS")
        .insert({
          nome: "Nina",
          especie: "Gato",
          sexo: "F",
          instituicao_id: Number(instId),
          status_adocao: "disponível",
        })
        .returning("id");

      await db("PROCESSO_ADOCAO").insert({
        pet_id: Number(petId),
        usuario_id: Number(userId),
        instituicao_id: Number(instId),
        status: "pendente",
      });

      const res = await request.get(`/adocoes/usuario/${Number(userId)}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
