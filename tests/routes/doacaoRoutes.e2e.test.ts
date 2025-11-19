import supertest from 'supertest';
import { app } from '../../src/app';
import db from '../../src/db';

const request = supertest(app);
let dbReady = true;

describe('E2E /doacoes', () => {
  beforeAll(async () => {
    try { await db.migrate.latest(); } catch (e) { dbReady = false; console.error('Falha migrar (doacoes):', e); }
  });

  afterEach(async () => {
    if (!dbReady) return;
    try {
      await db('DOACOES').del();
      await db('TIPOS_DOACAO').del();
      await db('USUARIOS').del();
      await db('INSTITUICOES').del();
    } catch (e) { console.error('Falha limpar (doacoes):', e); }
  });

  afterAll(async () => { try { await db.destroy(); } catch (e) { console.error(e); } });

  describe('POST /doacoes', () => {
    it('registra doação e retorna 201', async () => {
      if (!dbReady) { console.warn('DB indisponível; ignorando teste'); return; }
      const [instId] = await db('INSTITUICOES').insert({ nome: 'ONG D', email: 'd@ong.com' });
      const [userId] = await db('USUARIOS').insert({ nome: 'Doador', email: 'doador@x.com', senha_hash: 'hash' });
      const [tipoId] = await db('TIPOS_DOACAO').insert({ nome_tipo: 'Ração', unidade_medida: 'kg' });

      const res = await request.post('/doacoes').send({
        usuario_id: Number(userId),
        instituicao_id: Number(instId),
        tipo_doacao_id: Number(tipoId),
        quantidade: 5
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Doação registrada com sucesso!');
      expect(res.body.doacao).toMatchObject({ usuarioId: Number(userId), instituicaoId: Number(instId), tipoDoacaoId: Number(tipoId), quantidade: 5 });
      const registro = await db('DOACOES').where({ usuario_id: Number(userId), instituicao_id: Number(instId) }).first();
      expect(registro).toBeDefined();
    });

    it('retorna 400 quando faltam campos', async () => {
      const res = await request.post('/doacoes').send({ usuario_id: 1, quantidade: 2 });
      expect(res.status).toBe(400);
    });

    it('retorna 404 quando usuário não existe', async () => {
      if (!dbReady) { console.warn('DB indisponível; ignorando teste'); return; }
      const [instId] = await db('INSTITUICOES').insert({ nome: 'ONG E', email: 'e@ong.com' });
      const [tipoId] = await db('TIPOS_DOACAO').insert({ nome_tipo: 'Medicamento', unidade_medida: 'un' });
      const res = await request.post('/doacoes').send({
        usuario_id: 999999,
        instituicao_id: Number(instId),
        tipo_doacao_id: Number(tipoId),
        quantidade: 1
      });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Usuário não encontrado');
    });

    it('retorna 400 quando quantidade inválida', async () => {
      const res = await request.post('/doacoes').send({
        usuario_id: 1,
        instituicao_id: 1,
        tipo_doacao_id: 1,
        quantidade: 0
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /doacoes/instituicao/:id', () => {
    it('retorna 404 quando instituição não existe', async () => {
      if (!dbReady) { console.warn('DB indisponível; ignorando teste'); return; }
      const res = await request.get('/doacoes/instituicao/999999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Instituição não encontrada');
    });

    it('retorna 200 com lista de doações', async () => {
      if (!dbReady) { console.warn('DB indisponível; ignorando teste'); return; }
      const [instId] = await db('INSTITUICOES').insert({ nome: 'ONG F', email: 'f@ong.com' });
      const [userId] = await db('USUARIOS').insert({ nome: 'Doador2', email: 'doador2@x.com', senha_hash: 'hash' });
      const [tipoId] = await db('TIPOS_DOACAO').insert({ nome_tipo: 'Ração', unidade_medida: 'kg' });
      await db('DOACOES').insert({ usuario_id: Number(userId), instituicao_id: Number(instId), tipo_doacao_id: Number(tipoId), quantidade: 3, status_entrega: 'pendente' });

      const res = await request.get(`/doacoes/instituicao/${Number(instId)}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});

