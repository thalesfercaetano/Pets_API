import { EnderecoBusiness } from '../../src/business/enderecoBusiness';
import db from '../../src/db';

jest.mock('../../src/db');

const mockedDb = db as jest.MockedFunction<typeof db>;
const enderecoBusiness = new EnderecoBusiness();

describe('EnderecoBusiness', () => {
  beforeEach(() => jest.resetAllMocks());

  it('listarEnderecos formata a saída corretamente', async () => {
    const select = jest.fn().mockResolvedValue([
      {
        id: 1,
        rua: 'Rua Teste',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        latitude: -23.5505,
        longitude: -46.6333
      }
    ]);
    mockedDb.mockReturnValue({ select } as any);
    const res = await enderecoBusiness.listarEnderecos();
    expect(res).toEqual([
      {
        id: 1,
        rua: 'Rua Teste',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        latitude: -23.5505,
        longitude: -46.6333
      }
    ]);
  });

  it('criarEndereco insere e retorna dados', async () => {
    const mockFirst = jest.fn().mockResolvedValue({
      id: 123,
      rua: 'Rua Nova',
      numero: '456',
      complemento: null,
      bairro: 'Jardim',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20000000',
      latitude: null,
      longitude: null
    });
    const mockInsert = jest.fn().mockResolvedValue([123]);
    mockedDb.mockReturnValue({
      where: jest.fn().mockReturnValue({ first: mockFirst }),
      insert: mockInsert,
    } as any);
    
    const res = await enderecoBusiness.criarEndereco({
      rua: 'Rua Nova',
      numero: '456',
      bairro: 'Jardim',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20000000'
    });
    expect(res).toMatchObject({
      id: 123,
      rua: 'Rua Nova',
      numero: '456',
      bairro: 'Jardim',
      cidade: 'Rio de Janeiro',
      estado: 'RJ'
    });
  });

  it('buscarEnderecoPorId retorna null quando não existe', async () => {
    const first = jest.fn().mockResolvedValue(undefined);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ first }) } as any);
    const res = await enderecoBusiness.buscarEnderecoPorId(99);
    expect(res).toBeNull();
  });

  it('buscarEnderecoPorId retorna dados quando existe', async () => {
    const first = jest.fn().mockResolvedValue({
      id: 1,
      rua: 'Rua Teste',
      numero: '123',
      complemento: null,
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234567',
      latitude: -23.5505,
      longitude: -46.6333
    });
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ first }) } as any);
    const res = await enderecoBusiness.buscarEnderecoPorId(1);
    expect(res).toEqual({
      id: 1,
      rua: 'Rua Teste',
      numero: '123',
      complemento: null,
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234567',
      latitude: -23.5505,
      longitude: -46.6333
    });
  });

  it('atualizarEndereco sem campos retorna false', async () => {
    const res = await enderecoBusiness.atualizarEndereco(1, {});
    expect(res).toBe(false);
  });

  it('atualizarEndereco atualiza e retorna true', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(1);
    const mockWhere = jest.fn().mockReturnValue({
      update: mockUpdate
    });
    mockedDb.mockReturnValue({
      where: mockWhere,
    } as any);
    const res = await enderecoBusiness.atualizarEndereco(1, { rua: 'Rua Atualizada' });
    expect(res).toBe(true);
  });

  it('deletarEndereco retorna boolean conforme del', async () => {
    const mockFirstUsuario = jest.fn().mockResolvedValue(undefined); // Não está em uso
    const mockFirstInstituicao = jest.fn().mockResolvedValue(undefined);
    const delTrue = jest.fn().mockResolvedValue(1);
    
    let callCount = 0;
    mockedDb.mockImplementation((table: string) => {
      callCount++;
      if (table === 'USUARIOS') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
      }
      if (table === 'INSTITUICOES') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstInstituicao }) } as any;
      }
      if (table === 'ENDERECOS') {
        return { where: jest.fn().mockReturnValue({ del: delTrue }) } as any;
      }
      return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
    });
    
    expect(await enderecoBusiness.deletarEndereco(1)).toBe(true);

    const delFalse = jest.fn().mockResolvedValue(0);
    mockedDb.mockImplementation((table: string) => {
      if (table === 'USUARIOS') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
      }
      if (table === 'INSTITUICOES') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstInstituicao }) } as any;
      }
      if (table === 'ENDERECOS') {
        return { where: jest.fn().mockReturnValue({ del: delFalse }) } as any;
      }
      return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
    });
    
    expect(await enderecoBusiness.deletarEndereco(2)).toBe(false);
  });

  it('deletarEndereco lança erro se endereço está em uso por usuário', async () => {
    const mockFirstUsuario = jest.fn().mockResolvedValue({ id: 1, endereco_id: 1 });
    const mockFirstInstituicao = jest.fn().mockResolvedValue(undefined);
    
    let callCount = 0;
    mockedDb.mockImplementation((table: string) => {
      callCount++;
      if (table === 'USUARIOS') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
      }
      if (table === 'INSTITUICOES') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstInstituicao }) } as any;
      }
      return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
    });
    
    await expect(
      enderecoBusiness.deletarEndereco(1)
    ).rejects.toThrow('Endereço não pode ser deletado pois está em uso');
  });

  it('deletarEndereco lança erro se endereço está em uso por instituição', async () => {
    const mockFirstUsuario = jest.fn().mockResolvedValue(undefined);
    const mockFirstInstituicao = jest.fn().mockResolvedValue({ id: 1, endereco_id: 1 });
    
    let callCount = 0;
    mockedDb.mockImplementation((table: string) => {
      callCount++;
      if (table === 'USUARIOS') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
      }
      if (table === 'INSTITUICOES') {
        return { where: jest.fn().mockReturnValue({ first: mockFirstInstituicao }) } as any;
      }
      return { where: jest.fn().mockReturnValue({ first: mockFirstUsuario }) } as any;
    });
    
    await expect(
      enderecoBusiness.deletarEndereco(1)
    ).rejects.toThrow('Endereço não pode ser deletado pois está em uso');
  });
});

