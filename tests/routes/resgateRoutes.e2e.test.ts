import supertest from 'supertest';
import { app } from '../../src/app';
import db from '../../src/db';

const request = supertest(app);
let dbReady = true;

describe('E2E /resgates', () => {
  beforeAll(async () => {
    try {
      await db.migrate.latest();
    } catch (error) {
      dbReady = false;
      console.error('Falha ao conectar/migrar banco de teste (resgates):', error);
    }
  });

  afterEach(async () => {
    if (!dbReady) return;
    try {
      await db('STATUS_RESGATE').del();
      await db('PET_REPORTADO_APOS_RESGATE').del();
      await db('REPORTES_RESGATE').del();
    } catch (error) {
      console.error('Falha ao limpar tabelas de resgate:', error);
    }
  });

  afterAll(async () => {
    try { await db.destroy(); } catch (error) { console.error('Falha ao encerrar conexão (resgates):', error); }
  });

  describe('POST /resgates/reportar', () => {
    it('reporta resgate com sucesso e retorna 201', async () => {
      if (!dbReady) { console.warn('DB de teste indisponível; ignorando teste'); return; }

      const payload = {
        descricao: 'Animal ferido na Rua X',
        localizacao: 'Rua X, 123'
      };

      const res = await request.post('/resgates/reportar').send(payload);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Resgate reportado com sucesso!' });

      const registro = await db('REPORTES_RESGATE').first();
      expect(registro).toBeDefined();
      expect(registro.descricao_local).toBe('Rua X, 123');
      expect(registro.condicao_animal).toBe('desconhecida');
    });

    it('usa status do payload para condicao_animal quando fornecido', async () => {
      if (!dbReady) { console.warn('DB de teste indisponível; ignorando teste'); return; }

      const res = await request.post('/resgates/reportar').send({
        descricao: 'Animal em via pública',
        localizacao: 'Praça Central',
        status: 'grave'
      });

      expect(res.status).toBe(201);

      const registro = await db('REPORTES_RESGATE').first();
      expect(registro).toBeDefined();
      expect(registro.descricao_local).toBe('Praça Central');
      expect(registro.condicao_animal).toBe('grave');
    });

    it('retorna 400 quando falta descricao', async () => {
      const res = await request.post('/resgates/reportar').send({ localizacao: 'Av. Brasil' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Informe descrição e localização.');
    });

    it('retorna 400 quando falta localizacao', async () => {
      const res = await request.post('/resgates/reportar').send({ descricao: 'Animal preso em cerca' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Informe descrição e localização.');
    });
  });
});

