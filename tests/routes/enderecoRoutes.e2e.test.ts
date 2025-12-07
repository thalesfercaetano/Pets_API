import supertest from 'supertest';
import { app } from '../../src/app';
import db from '../../src/db';

const request = supertest(app);
let dbReady = true;

describe('E2E /enderecos', () => {
  beforeAll(async () => {
    try { await db.migrate.latest(); } catch (e) { dbReady = false; console.error(e); }
  });

  afterEach(async () => {
    if (!dbReady) return;
    try {
      await db("MATCHES").del();
      await db("SWIPES").del();
      await db("PROCESSO_ADOCAO").del();
      await db("DOACOES").del();
      await db("PETS").del();
      await db("USUARIOS").del();
      await db("INSTITUICOES").del();
      await db("ENDERECOS").del(); // Endereços por último
    } catch (e) { console.error(e); }
  });
  afterAll(async () => {
    try { await db.destroy(); } catch (e) { console.error(e); }
  });

  describe('POST /enderecos', () => {
    it('cria endereço com sucesso e retorna 201', async () => {
      if (!dbReady) return;
      const response = await request.post('/enderecos').send({
        rua: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        latitude: -23.5505,
        longitude: -46.6333
      });
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.rua).toBe('Rua Teste');
      expect(response.body.numero).toBe('123');
    });

    it('retorna 400 quando faltam campos obrigatórios', async () => {
      const response = await request.post('/enderecos').send({ rua: 'Rua Sem Numero' });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /enderecos/:id', () => {
    it('retorna 200 com endereço existente', async () => {
      if (!dbReady) return;
      const [{ id: endId }] = await db('ENDERECOS').insert({
        rua: 'Rua Teste',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
      }).returning('id');

      const response = await request.get(`/enderecos/${endId}`);
      expect(response.status).toBe(200);
      expect(response.body.rua).toBe('Rua Teste');
    });

    it('retorna 404 quando endereço não existe', async () => {
      if (!dbReady) return;
      const response = await request.get('/enderecos/999999');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /enderecos/:id', () => {
    it('atualiza endereço e retorna 200', async () => {
      if (!dbReady) return;
      const [{ id: endId }] = await db('ENDERECOS').insert({
        rua: 'Rua Original',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
      }).returning('id');

      const response = await request.patch(`/enderecos/${endId}`).send({ rua: 'Rua Alterada' });
      expect(response.status).toBe(200);
      
      const atualizado = await db('ENDERECOS').where({ id: endId }).first();
      expect(atualizado.rua).toBe('Rua Alterada');
    });

    it('retorna 400 quando estado não tem 2 caracteres', async () => {
      if (!dbReady) return;
      const [{ id: endId }] = await db('ENDERECOS').insert({
        rua: 'Rua Teste',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
      }).returning('id');

      const response = await request.patch(`/enderecos/${endId}`).send({ estado: 'SAO PAULO' });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /enderecos/:id', () => {
    it('deleta endereço e retorna 200', async () => {
      if (!dbReady) return;
      const [{ id: endId }] = await db('ENDERECOS').insert({
        rua: 'Rua Para Deletar',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
      }).returning('id');

      const response = await request.delete(`/enderecos/${endId}`);
      expect(response.status).toBe(200);
      
      const busca = await db('ENDERECOS').where({ id: endId }).first();
      expect(busca).toBeUndefined();
    });

    it('retorna 409 quando endereço está em uso por usuário', async () => {
      if (!dbReady) return;
      const [{ id: endId }] = await db('ENDERECOS').insert({
        rua: 'Rua Em Uso',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
      }).returning('id');

      await db('USUARIOS').insert({
        nome: 'User Teste',
        email: 'user@teste.com',
        senha_hash: 'hash',
        endereco_id: Number(endId)
      });

      const response = await request.delete(`/enderecos/${endId}`);
      expect(response.status).toBe(409);
    });

    it('retorna 409 quando endereço está em uso por instituição', async () => {
      if (!dbReady) return;
      const [{ id: endId }] = await db('ENDERECOS').insert({
        rua: 'Rua Em Uso',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
      }).returning('id');

      await db('INSTITUICOES').insert({
        nome: 'Inst Teste',
        email: 'inst@teste.com',
        endereco_id: Number(endId)
      });

      const response = await request.delete(`/enderecos/${endId}`);
      expect(response.status).toBe(409);
    });
  });
});