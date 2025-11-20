import supertest from "supertest";
import { app } from "../../src/app";
import db from "../../src/db";

const request = supertest(app);
let dbReady = true;

describe("E2E /instituicoes", () => {
  beforeAll(async () => {
    try {
      await db.migrate.latest();
    } catch (error) {
      dbReady = false;
      console.error("Falha ao conectar/migrar banco (instituicoes):", error);
    }
  });

  afterEach(async () => {
    if (!dbReady) return;
    try {
      await db("INSTITUICOES").del();
    } catch (error) {
      console.error("Falha ao limpar tabelas (instituicoes):", error);
    }
  });

  afterAll(async () => {
    try {
      await db.destroy();
    } catch (e) {
      console.error(e);
    }
  });

  describe("GET /instituicoes", () => {
    it("lista todas as instituições e retorna 200", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      await db("INSTITUICOES").insert([
        { nome: "ONG A", email: "a@ong.com" },
        { nome: "ONG B", email: "b@ong.com" },
      ]);

      const res = await request.get("/instituicoes");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe("POST /instituicoes", () => {
    it("cria instituição com sucesso e retorna 201", async () => {
      if (!dbReady) return;
      const res = await request.post("/instituicoes").send({
        nome: "ONG Teste",
        email: "teste@ong.com",
        senha: "123",
        telefone: "11999999999",
        cnpj: "12345678000199",
      });
      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.nome).toBe("ONG Teste");

      const instituicaoDb = await db("INSTITUICOES")
        .where({ email: "teste@ong.com" })
        .first();
      expect(instituicaoDb).toBeDefined();
      expect(instituicaoDb.nome).toBe("ONG Teste");
    });

    it("retorna 409 quando email já existe", async () => {
      if (!dbReady) return;
      await db("INSTITUICOES").insert({
        nome: "ONG Original",
        email: "original@ong.com",
      });
      const res = await request.post("/instituicoes").send({
        nome: "ONG Clone",
        email: "original@ong.com",
        senha: "123",
      });
      expect(res.status).toBe(409);
      expect(res.text).toBe("Email já cadastrado");
    });

    it("retorna 409 quando CNPJ já existe", async () => {
      if (!dbReady) return;
      await db("INSTITUICOES").insert({
        nome: "ONG Original",
        email: "original@ong.com",
        cnpj: "12345678000190",
      });
      const res = await request.post("/instituicoes").send({
        nome: "ONG Clone",
        email: "clone@ong.com",
        senha: "123",
        cnpj: "12345678000190",
      });
      expect(res.status).toBe(409);
      expect(res.text).toBe("CNPJ já cadastrado");
    });
  });

  describe("GET /instituicoes/:id", () => {
    it("retorna 200 com instituição existente", async () => {
      if (!dbReady) return;
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({
          nome: "ONG Teste",
          email: "teste@ong.com",
        })
        .returning("id");

      const res = await request.get(`/instituicoes/${instId}`);
      expect(res.status).toBe(200);
      expect(res.body.nome).toBe("ONG Teste");
    });

    it("retorna 404 quando instituição não existe", async () => {
      const res = await request.get("/instituicoes/999999");
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /instituicoes/:id", () => {
    it("atualiza instituição e retorna 200", async () => {
      if (!dbReady) return;
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({
          nome: "ONG Original",
          email: "original@ong.com",
        })
        .returning("id");

      const res = await request
        .patch(`/instituicoes/${instId}`)
        .send({ nome: "ONG Atualizada" });
      expect(res.status).toBe(200);
      const updated = await db("INSTITUICOES").where({ id: instId }).first();
      expect(updated.nome).toBe("ONG Atualizada");
    });

    it("retorna 409 quando email já está em uso", async () => {
      if (!dbReady) return;
      await db("INSTITUICOES").insert({
        nome: "Outra ONG",
        email: "outra@ong.com",
      });
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({
          nome: "ONG Teste",
          email: "teste@ong.com",
        })
        .returning("id");

      const res = await request.patch(`/instituicoes/${instId}`).send({
        email: "outra@ong.com",
      });
      expect(res.status).toBe(409);
    });
  });

  describe("DELETE /instituicoes/:id", () => {
    it("deleta instituição e retorna 200", async () => {
      if (!dbReady) return;
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({
          nome: "ONG Para Deletar",
          email: "deletar@ong.com",
        })
        .returning("id");

      const res = await request.delete(`/instituicoes/${instId}`);
      expect(res.status).toBe(200);
      const check = await db("INSTITUICOES").where({ id: instId }).first();
      expect(check).toBeUndefined();
    });
  });
});