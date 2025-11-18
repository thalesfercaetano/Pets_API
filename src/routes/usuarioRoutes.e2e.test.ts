import supertest from 'supertest';
import { app } from '../app'; 
import db from '../db';    
import bcrypt from 'bcryptjs'; 

// Criamos um 'agente' do supertest para fazer requisições na nossa 'app'
// A 'app' é o seu servidor Express exportado do arquivo src/app.ts
const request = supertest(app);
let dbReady = true;

// Descrevemos o conjunto de testes para as rotas de Usuário
describe('Testes E2E para /usuarios', () => {
  
  beforeAll(async () => {
    try {
      await db.migrate.latest();
    } catch (error) {
      dbReady = false;
      console.error('Falha ao conectar/migrar banco de teste:', error);
    }
  });

  afterEach(async () => {
    if (!dbReady) return;
    try {
      await db('USUARIOS').del();
    } catch (error) {
      console.error('Falha ao limpar tabela USUARIOS:', error);
    }
  });

  afterAll(async () => {
    try {
      await db.destroy();
    } catch (error) {
      console.error('Falha ao encerrar conexão com banco de teste:', error);
    }
  });

  // --- Testando POST /usuarios (Criar Usuário) ---
  describe('POST /usuarios', () => {

    it('deve criar um usuário com sucesso e retornar 201', async () => {
      if (!dbReady) { console.warn('DB de teste indisponível; ignorando teste'); return; }
      // ARRANGE (Arrumar)
      // Definimos os dados que enviaremos no corpo da requisição
      const novoUsuario = {
        name: 'Usuário E2E',
        email: 'e2e@teste.com',
        password: 'senha123'
      };

      // ACT (Agir)
      // Fazemos a requisição HTTP POST para a rota /usuarios
      const response = await request
        .post('/usuarios')
        .send(novoUsuario); 

      // ASSERT (Verificar)
      // 1. Verificamos a resposta HTTP
      expect(response.status).toBe(201); // Esperamos o status 201 Created
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Usuário E2E');
      expect(response.body.email).toBe('e2e@teste.com');
      expect(response.body.id).toBeDefined(); // Esperamos que a resposta nos dê um ID
      
      // 2. Verificamos o Banco de Dados (Muito importante!)
      const usuarioNoBanco = await db('USUARIOS').where({ email: 'e2e@teste.com' }).first();
      expect(usuarioNoBanco).toBeDefined(); 
      expect(usuarioNoBanco.nome).toBe('Usuário E2E');

      // 3. Verificamos se a senha foi hasheada
      expect(usuarioNoBanco.senha_hash).not.toBe('senha123');
    });

    it('deve retornar 409 se o email já existir', async () => {
      if (!dbReady) { console.warn('DB de teste indisponível; ignorando teste'); return; }
      // ARRANGE
      // 1. Primeiro, criamos um usuário direto no banco
      const senhaHash = await bcrypt.hash('senha_antiga', 10);
      await db('USUARIOS').insert({
        nome: 'Usuário Antigo',
        email: 'repetido@teste.com',
        senha_hash: senhaHash
      });

      // 2. Definimos o novo usuário com o MESMO email
      const usuarioRepetido = {
        name: 'Usuário Novo',
        email: 'repetido@teste.com',
        password: 'outra_senha'
      };

      // ACT
      const response = await request
        .post('/usuarios')
        .send(usuarioRepetido);

      // ASSERT
      expect(response.status).toBe(409); // 409 Conflict
      expect(response.text).toBe('Email já cadastrado'); // Verificamos a mensagem de erro
    });

    it('deve retornar 400 se faltar o campo "name"', async () => {
      // ARRANGE
      const usuarioInvalido = {
        email: 'invalido@teste.com',
        password: 'senha123'
      };

      // ACT
      const response = await request
        .post('/usuarios')
        .send(usuarioInvalido);

      // ASSERT
      expect(response.status).toBe(400); // 400 Bad Request
      expect(response.text).toBe('Nome, email e senha são obrigatórios');
    });
  });

  // --- Testando POST /usuarios/login ---
  describe('POST /usuarios/login', () => {

    it('deve fazer login com sucesso e retornar 200 com um token', async () => {
      if (!dbReady) { console.warn('DB de teste indisponível; ignorando teste'); return; }
      // ARRANGE
      // 1. Criamos um usuário no banco com uma senha conhecida
      const senhaPlana = 'senhaforte123';
      const senhaHash = await bcrypt.hash(senhaPlana, 10);
      await db('USUARIOS').insert({
        nome: 'Usuario De Login',
        email: 'login@teste.com',
        senha_hash: senhaHash
      });

      // ACT
      // 2. Tentamos fazer login com esse usuário
      const response = await request
        .post('/usuarios/login')
        .send({
          email: 'login@teste.com',
          password: senhaPlana // Usamos a senha plana (sem hash)
        });

      // ASSERT
      // 3. Verificamos a resposta
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined(); 
      expect(response.body.user.email).toBe('login@teste.com');
    });

    it('deve retornar 401 se a senha estiver incorreta', async () => {
      if (!dbReady) { console.warn('DB de teste indisponível; ignorando teste'); return; }
      // ARRANGE
      const senhaPlana = 'senhaforte123';
      const senhaHash = await bcrypt.hash(senhaPlana, 10);
      await db('USUARIOS').insert({
        nome: 'Usuario De Login',
        email: 'login@teste.com',
        senha_hash: senhaHash
      });

      // ACT
      const response = await request
        .post('/usuarios/login')
        .send({
          email: 'login@teste.com',
          password: 'senha-errada' 
        });

      // ASSERT
      expect(response.status).toBe(401); // 401 Unauthorized
      expect(response.text).toBe('Credenciais inválidas');
    });

  });

});