import { UsuarioBusiness } from './usuarioBusiness';
import db from '../db'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

// 1. SIMULANDO (MOCKANDO) OS MÓDULOS
jest.mock('../db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// 2. PREPARANDO OS MOCKS COM TIPAGEM
const mockedDb = db as jest.MockedFunction<typeof db>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// 3. INSTANCIANDO A CLASSE
const usuarioBusiness = new UsuarioBusiness();

// 4. DESCREVENDO O CONJUNTO DE TESTES
describe('Testes para UsuarioBusiness', () => {
  
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // --- Testando o método criarUsuario ---
  describe('criarUsuario', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      // 1. Simular o Knex
      const mockFirst = jest.fn();
      const mockInsert = jest.fn().mockResolvedValue([1]);

      // Definimos a sequência de retornos para 'first()'
      mockFirst
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({
          id: 1,
          nome: 'Usuário Teste',
          email: 'teste@exemplo.com',
        });

      mockedDb.mockReturnValue({
        where: jest.fn().mockReturnValue({
          first: mockFirst,
        }),
        insert: mockInsert,
      } as any);

      // 2. Simular o bcrypt.hash
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue(
        'senha_hasheada_fake'
      );

      // ACT
      const novoUsuario = {
        name: 'Usuário Teste',
        email: 'teste@exemplo.com',
        password: 'senha123',
      };
      const resultado = await usuarioBusiness.criarUsuario(novoUsuario);

      // ASSERT
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe(1);
      expect(resultado.name).toBe('Usuário Teste');
      expect(mockedDb).toHaveBeenCalledWith('USUARIOS');
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(mockInsert).toHaveBeenCalledWith({
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        senha_hash: 'senha_hasheada_fake',
      });
    });

    it('deve lançar um erro se o email já estiver cadastrado', async () => {
      // ARRANGE
      // 1. Simular o Knex (só precisamos simular a primeira busca)
      const mockFirst = jest.fn().mockResolvedValue({
        id: 2,
        nome: 'Usuário Antigo',
        email: 'email_ja_existe@exemplo.com',
        senha_hash: 'outra_senha',
      });

      mockedDb.mockReturnValue({
        where: jest.fn().mockReturnValue({
          first: mockFirst,
        }),
      } as any);

      // ACT & ASSERT
      const usuarioExistente = {
        name: 'Usuário Novo',
        email: 'email_ja_existe@exemplo.com',
        password: 'senha456',
      };

      // Verifica se a promessa foi rejeitada COM a mensagem de erro específica
      await expect(
        usuarioBusiness.criarUsuario(usuarioExistente)
      ).rejects.toThrow('Email já cadastrado');

      // Garantimos que o hash não foi chamado
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    });
  });

  // --- Testando o método login ---
  describe('login', () => {
    it('deve fazer login e retornar um token com sucesso', async () => {
      // ARRANGE
      // 1. Simular o Knex
      const mockUsuarioDoBanco = {
        id: 1,
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        senha_hash: 'senha_hasheada_correta',
      };
      const mockFirst = jest.fn().mockResolvedValue(mockUsuarioDoBanco);
      mockedDb.mockReturnValue({
        where: jest.fn().mockReturnValue({ first: mockFirst }),
      } as any);

      // 2. Simular o bcrypt.compare
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true); // Senha válida

      // 3. Simular o jwt.sign

      (mockedJwt.sign as jest.Mock).mockReturnValue('token_jwt_fake');

      // ACT
      const resultado = await usuarioBusiness.login({
        email: 'teste@exemplo.com',
        password: 'senha_correta',
      });

      // ASSERT
      expect(resultado.token).toBe('token_jwt_fake');
      expect(resultado.user.name).toBe('Usuário Teste');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'senha_correta',
        'senha_hasheada_correta'
      );
      expect(mockedJwt.sign).toHaveBeenCalled();
    });

    it('deve lançar um erro se a senha estiver incorreta', async () => {
      // ARRANGE
      // 1. Simular o Knex
      const mockUsuarioDoBanco = {
        id: 1,
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        senha_hash: 'senha_hasheada_correta',
      };
      const mockFirst = jest.fn().mockResolvedValue(mockUsuarioDoBanco);
      mockedDb.mockReturnValue({
        where: jest.fn().mockReturnValue({ first: mockFirst }),
      } as any);

      // 2. Simular o bcrypt.compare
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false); 

      // ACT & ASSERT
      await expect(
        usuarioBusiness.login({
          email: 'teste@exemplo.com',
          password: 'senha_incorreta',
        })
      ).rejects.toThrow('Credenciais inválidas');

      // Garantir que o token NÃO foi gerado
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });
  });
});