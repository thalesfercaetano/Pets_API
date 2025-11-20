import { InstituicaoBusiness } from '../../src/business/instituicaoBusiness';
import db from '../../src/db';

jest.mock('../../src/db');

const mockedDb = db as jest.MockedFunction<typeof db>;
const instituicaoBusiness = new InstituicaoBusiness();

describe('InstituicaoBusiness', () => {
  beforeEach(() => jest.resetAllMocks());

  it('listarInstituicoes formata a saída corretamente', async () => {
    const select = jest.fn().mockResolvedValue([
      {
        id: 1,
        nome: 'ONG Teste',
        cnpj: '12345678000190',
        email: 'teste@ong.com',
        telefone: '11999999999',
        link_site: 'https://teste.com',
        descricao: 'Descrição teste',
        endereco_id: 1,
        data_cadastro: '2025-01-01'
      }
    ]);
    mockedDb.mockReturnValue({ select } as any);
    const res = await instituicaoBusiness.listarInstituicoes();
    expect(res).toEqual([
      {
        id: 1,
        nome: 'ONG Teste',
        cnpj: '12345678000190',
        email: 'teste@ong.com',
        telefone: '11999999999',
        link_site: 'https://teste.com',
        descricao: 'Descrição teste',
        endereco_id: 1,
        data_cadastro: '2025-01-01'
      }
    ]);
  });

  it('criarInstituicao insere e retorna dados', async () => {
    const mockFirstEmail = jest.fn().mockResolvedValue(undefined); // Email não existe
    const mockFirstCnpj = jest.fn().mockResolvedValue(undefined); // CNPJ não existe
    const instituicaoCriada = {
      id: 123,
      nome: 'ONG Nova',
      cnpj: '12345678000190',
      email: 'nova@ong.com',
      telefone: null,
      link_site: null,
      descricao: null,
      endereco_id: null,
      data_cadastro: '2025-01-01'
    };
    const mockReturning = jest.fn().mockResolvedValue([instituicaoCriada]);
    const mockInsert = jest.fn().mockReturnValue({ returning: mockReturning });
    
    let whereCallCount = 0;
    const mockWhere = jest.fn().mockImplementation((condition) => {
      whereCallCount++;
      // Primeira chamada: verifica email
      if (whereCallCount === 1 && condition && condition.email) {
        return { first: mockFirstEmail };
      }
      // Segunda chamada: verifica CNPJ
      if (whereCallCount === 2 && condition && condition.cnpj) {
        return { first: mockFirstCnpj };
      }
      return { first: mockFirstEmail };
    });
    
    mockedDb.mockReturnValue({
      where: mockWhere,
      insert: mockInsert,
    } as any);
    
    const res = await instituicaoBusiness.criarInstituicao({
      nome: 'ONG Nova',
      email: 'nova@ong.com',
      cnpj: '12345678000190'
    });
    expect(res).toMatchObject({
      id: 123,
      nome: 'ONG Nova',
      email: 'nova@ong.com',
      cnpj: '12345678000190'
    });
  });

  it('criarInstituicao lança erro se email já existe', async () => {
    const mockFirst = jest.fn().mockResolvedValue({
      id: 1,
      nome: 'ONG Existente',
      email: 'existente@ong.com'
    });
    mockedDb.mockReturnValue({
      where: jest.fn().mockReturnValue({ first: mockFirst }),
    } as any);
    await expect(
      instituicaoBusiness.criarInstituicao({
        nome: 'ONG Nova',
        email: 'existente@ong.com'
      })
    ).rejects.toThrow('Email já cadastrado');
  });

  it('criarInstituicao lança erro se CNPJ já existe', async () => {
    const mockFirstEmail = jest.fn().mockResolvedValue(undefined); // Email não existe
    const mockFirstCnpj = jest.fn().mockResolvedValue({ id: 1, cnpj: '12345678000190' }); // CNPJ existe
    
    const mockWhere = jest.fn().mockImplementation((condition) => {
      if (condition.email) {
        return { first: mockFirstEmail };
      } else if (condition.cnpj) {
        return { first: mockFirstCnpj };
      }
      return { first: mockFirstEmail };
    });
    
    mockedDb.mockReturnValue({
      where: mockWhere,
    } as any);
    
    await expect(
      instituicaoBusiness.criarInstituicao({
        nome: 'ONG Nova',
        email: 'nova@ong.com',
        cnpj: '12345678000190'
      })
    ).rejects.toThrow('CNPJ já cadastrado');
  });

  it('buscarInstituicaoPorId retorna null quando não existe', async () => {
    const first = jest.fn().mockResolvedValue(undefined);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ first }) } as any);
    const res = await instituicaoBusiness.buscarInstituicaoPorId(99);
    expect(res).toBeNull();
  });

  it('buscarInstituicaoPorId retorna dados quando existe', async () => {
    const first = jest.fn().mockResolvedValue({
      id: 1,
      nome: 'ONG Teste',
      cnpj: '12345678000190',
      email: 'teste@ong.com',
      telefone: '11999999999',
      link_site: null,
      descricao: null,
      endereco_id: null,
      data_cadastro: '2025-01-01'
    });
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ first }) } as any);
    const res = await instituicaoBusiness.buscarInstituicaoPorId(1);
    expect(res).toEqual({
      id: 1,
      nome: 'ONG Teste',
      cnpj: '12345678000190',
      email: 'teste@ong.com',
      telefone: '11999999999',
      link_site: null,
      descricao: null,
      endereco_id: null,
      data_cadastro: '2025-01-01'
    });
  });

  it('atualizarInstituicao sem campos retorna false', async () => {
    const res = await instituicaoBusiness.atualizarInstituicao(1, {});
    expect(res).toBe(false);
  });

  it('atualizarInstituicao atualiza e retorna true', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(1);
    const mockWhere = jest.fn().mockReturnValue({
      update: mockUpdate
    });
    mockedDb.mockReturnValue({
      where: mockWhere,
    } as any);
    const res = await instituicaoBusiness.atualizarInstituicao(1, { nome: 'ONG Atualizada' });
    expect(res).toBe(true);
  });

  it('atualizarInstituicao lança erro se email já está em uso', async () => {
    const mockFirst = jest.fn().mockResolvedValue({
      id: 2,
      email: 'outro@ong.com'
    });
    const mockWhereNot = jest.fn().mockReturnValue({ first: mockFirst });
    const mockWhere = jest.fn().mockReturnValue({ whereNot: mockWhereNot });
    mockedDb.mockReturnValue({
      where: mockWhere,
    } as any);
    await expect(
      instituicaoBusiness.atualizarInstituicao(1, { email: 'outro@ong.com' })
    ).rejects.toThrow('Email já está em uso por outra instituição');
  });

  it('atualizarInstituicao lança erro se CNPJ já está em uso', async () => {
    const mockFirst = jest.fn().mockResolvedValue({
      id: 2,
      cnpj: '12345678000190'
    });
    const mockWhereNot = jest.fn().mockReturnValue({ first: mockFirst });
    const mockWhere = jest.fn().mockReturnValue({ whereNot: mockWhereNot });
    mockedDb.mockReturnValue({
      where: mockWhere,
    } as any);
    await expect(
      instituicaoBusiness.atualizarInstituicao(1, { cnpj: '12345678000190' })
    ).rejects.toThrow('CNPJ já está em uso por outra instituição');
  });

  it('deletarInstituicao retorna boolean conforme del', async () => {
    const delTrue = jest.fn().mockResolvedValue(1);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ del: delTrue }) } as any);
    expect(await instituicaoBusiness.deletarInstituicao(1)).toBe(true);

    const delFalse = jest.fn().mockResolvedValue(0);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ del: delFalse }) } as any);
    expect(await instituicaoBusiness.deletarInstituicao(2)).toBe(false);
  });
});

