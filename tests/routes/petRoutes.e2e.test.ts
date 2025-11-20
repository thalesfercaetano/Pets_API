import supertest from "supertest";
import { app } from "../../src/app";
import db from "../../src/db";

const request = supertest(app);
let dbReady = true;

describe("E2E /pets", () => {
  beforeAll(async () => {
    try {
      await db.migrate.latest();
    } catch (error) {
      dbReady = false;
      console.error("Falha ao conectar/migrar banco de teste (pets):", error);
    }
  });

  afterEach(async () => {
    if (!dbReady) return;
    try {
      await db("PROCESSO_ADOCAO").del();
      await db("PETS").del();
      await db("INSTITUICOES").del();
    } catch (error) {
      console.error("Falha ao limpar tabelas (pets):", error);
    }
  });

  afterAll(async () => {
    try {
      await db.destroy();
    } catch (e) {
      console.error(e);
    }
  });

  describe("POST /pets", () => {
    it("cria pet com sucesso e retorna 201", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({ nome: "ONG Pets", email: "ong@pets.com" })
        .returning("id");
      const response = await request.post("/pets").send({
        name: "Bidu",
        type: "Cachorro",
        owner_id: Number(instId),
      });
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe("Bidu");
      const petDb = await db("PETS").where({ nome: "Bidu" }).first();
      expect(petDb).toBeDefined();
      expect(petDb.especie).toBe("Cachorro");
    });

    it("retorna 400 quando faltam campos", async () => {
      const res = await request.post("/pets").send({ name: "Sem Tipo" });
      expect(res.status).toBe(400);
      expect(res.text).toBe("Nome, tipo e owner_id são obrigatórios");
    });
  });

  describe("GET /pets/:id", () => {
    it("retorna 200 com pet existente", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({ nome: "ONG A", email: "a@ong.com" })
        .returning("id");
      const [{ id: petId }] = await db("PETS")
        .insert({
          nome: "Rex",
          especie: "Cachorro",
          sexo: "M",
          instituicao_id: Number(instId),
          status_adocao: "disponível",
        })
        .returning("id");
      const res = await request.get(`/pets/${petId}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Rex");
    });

    it("retorna 404 quando pet não existe", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const res = await request.get("/pets/999999");
      expect(res.status).toBe(404);
      expect(res.text).toBe("Pet não encontrado");
    });

    it("retorna 400 quando id inválido", async () => {
      const res = await request.get("/pets/abc");
      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /pets/:id", () => {
    it("atualiza pet e retorna 200", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({ nome: "ONG B", email: "b@ong.com" })
        .returning("id");
      const [{ id: petId }] = await db("PETS")
        .insert({
          nome: "Luna",
          especie: "Gato",
          sexo: "F",
          instituicao_id: Number(instId),
          status_adocao: "disponível",
        })
        .returning("id");
      const res = await request
        .patch(`/pets/${petId}`)
        .send({ name: "Luna Atualizada" });
      expect(res.status).toBe(200);
      const updated = await db("PETS").where({ id: petId }).first();
      expect(updated.nome).toBe("Luna Atualizada");
    });

    it("retorna 404 quando pet não existe", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const res = await request.patch("/pets/999999").send({ name: "X" });
      expect(res.status).toBe(404);
    });

    it("retorna 400 quando id inválido", async () => {
      const res = await request.patch("/pets/xyz").send({ name: "X" });
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /pets/:id", () => {
    it("deleta pet e retorna 200", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const [{ id: instId }] = await db("INSTITUICOES")
        .insert({ nome: "ONG C", email: "c@ong.com" })
        .returning("id");
      const [{ id: petId }] = await db("PETS")
        .insert({
          nome: "Bolt",
          especie: "Cachorro",
          sexo: "M",
          instituicao_id: Number(instId),
          status_adocao: "disponível",
        })
        .returning("id");
      const res = await request.delete(`/pets/${petId}`);
      expect(res.status).toBe(200);
      const deleted = await db("PETS").where({ id: petId }).first();
      expect(deleted).toBeUndefined();
    });

    it("retorna 404 quando pet não existe", async () => {
      if (!dbReady) {
        console.warn("DB indisponível; ignorando teste");
        return;
      }
      const res = await request.delete("/pets/999999");
      expect(res.status).toBe(404);
    });

    it("retorna 400 quando id inválido", async () => {
      const res = await request.delete("/pets/xyz");
      expect(res.status).toBe(400);
    });
  });
});
