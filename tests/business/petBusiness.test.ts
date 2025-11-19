import { PetBusiness } from '../../src/business/petBusiness';
import db from '../../src/db';

jest.mock('../../src/db');

const mockedDb = db as jest.MockedFunction<typeof db>;
const petBusiness = new PetBusiness();

describe('PetBusiness', () => {
  beforeEach(() => jest.resetAllMocks());

  it('listarPets formata a saída corretamente', async () => {
    const select = jest.fn().mockResolvedValue([
      { id: 1, nome: 'P', especie: 'C', instituicao_id: 10, vacinado: true, castrado: false, cor: 'preto', data_cadastro: '2025', ativo: true }
    ]);
    mockedDb.mockReturnValue({ select } as any);
    const res = await petBusiness.listarPets();
    expect(res).toEqual([
      { id: 1, name: 'P', type: 'C', owner_id: 10, vacinado: true, castrado: false, cor: 'preto', data_cadastro: '2025', ativo: true }
    ]);
  });

  it('criarPet insere e retorna dados', async () => {
    const insert = jest.fn().mockResolvedValue([123]);
    mockedDb.mockReturnValue({ insert } as any);
    const res = await petBusiness.criarPet({ name: 'P', type: 'C', owner_id: 10 });
    expect(res).toMatchObject({ id: 123, name: 'P', type: 'C', owner_id: 10 });
  });

  it('buscarPetPorId retorna null quando não existe', async () => {
    const first = jest.fn().mockResolvedValue(undefined);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ first }) } as any);
    const res = await petBusiness.buscarPetPorId(99);
    expect(res).toBeNull();
  });

  it('buscarPetPorId retorna dados quando existe', async () => {
    const first = jest.fn().mockResolvedValue({
      id: 1, nome: 'P', especie: 'C', instituicao_id: 10, vacinado: true, castrado: false, cor: null, data_cadastro: '2025', ativo: true
    });
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ first }) } as any);
    const res = await petBusiness.buscarPetPorId(1);
    expect(res).toEqual({
      id: 1, name: 'P', type: 'C', owner_id: 10, vacinado: true, castrado: false, cor: null, data_cadastro: '2025', ativo: true
    });
  });

  it('atualizarPet sem campos retorna false', async () => {
    const res = await petBusiness.atualizarPet(1, {});
    expect(res).toBe(false);
  });

  it('atualizarPet atualiza e retorna true', async () => {
    const update = jest.fn().mockResolvedValue(1);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ update }) } as any);
    const res = await petBusiness.atualizarPet(1, { name: 'X' });
    expect(res).toBe(true);
  });

  it('deletarPet retorna boolean conforme del', async () => {
    const delTrue = jest.fn().mockResolvedValue(1);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ del: delTrue }) } as any);
    expect(await petBusiness.deletarPet(1)).toBe(true);

    const delFalse = jest.fn().mockResolvedValue(0);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ del: delFalse }) } as any);
    expect(await petBusiness.deletarPet(2)).toBe(false);
  });
});

