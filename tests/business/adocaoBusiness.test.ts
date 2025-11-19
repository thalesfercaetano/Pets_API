import { AdocaoBusiness } from '../../src/business/adocaoBusiness';
import db from '../../src/db';

jest.mock('../../src/db');

const mockedDb = db as jest.MockedFunction<typeof db>;
const adocaoBusiness = new AdocaoBusiness();

describe('AdocaoBusiness', () => {
  beforeEach(() => jest.resetAllMocks());

  it('criarAdocao lança erro quando pet não existe', async () => {
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue(undefined) }) } as any);
    await expect(adocaoBusiness.criarAdocao({ usuario_id: 1, pet_id: 99 } as any)).rejects.toThrow('Pet não encontrado');
  });

  it('criarAdocao insere quando pet existe', async () => {
    const firstPet = jest.fn().mockResolvedValue({ id: 5, instituicao_id: 7 });
    const insertPa = jest.fn().mockResolvedValue([1]);
    mockedDb
      .mockImplementationOnce(() => ({ where: jest.fn().mockReturnValue({ first: firstPet }) } as any))
      .mockImplementationOnce(() => ({ insert: insertPa } as any));
    const res = await adocaoBusiness.criarAdocao({ usuario_id: 1, pet_id: 5 } as any);
    expect(res).toEqual([1]);
  });

  it('atualizarStatus atualiza linha', async () => {
    const update = jest.fn().mockResolvedValue(1);
    mockedDb.mockReturnValue({ where: jest.fn().mockReturnValue({ update }) } as any);
    const rows = await adocaoBusiness.atualizarStatus(1, 'aprovada');
    expect(rows).toBe(1);
  });

  it('listarAdocoesPorUsuario retorna usuarioExiste=false quando não há usuário', async () => {
    const firstUserNotFound = jest.fn().mockResolvedValue(undefined);
    mockedDb.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstUserNotFound }) } as any);
    const res = await adocaoBusiness.listarAdocoesPorUsuario(999);
    expect(res).toEqual({ usuarioExiste: false, adocoes: [] });
  });

  it('listarAdocoesPorUsuario retorna lista formatada quando há usuário', async () => {
    const firstUser = jest.fn().mockResolvedValue({ id: 1 });
    const select = jest.fn().mockResolvedValue([{
      id: 2, pet_id: 5, status: 'pendente', data_solicitacao: '2025', instituicao_id: 7, pet_nome: 'P', pet_especie: 'C', instituicao_nome: 'ONG'
    }]);
    mockedDb
      .mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstUser }) } as any)
      .mockReturnValueOnce({ leftJoin: jest.fn().mockReturnValue({ leftJoin: jest.fn().mockReturnValue({ where: jest.fn().mockReturnValue({ orderBy: jest.fn().mockReturnValue({ select }) }) }) }) } as any);
    const res = await adocaoBusiness.listarAdocoesPorUsuario(1);
    expect(res.usuarioExiste).toBe(true);
    expect(res.adocoes[0]).toEqual({
      id: 2, petId: 5, petName: 'P', petSpecies: 'C', status: 'pendente', requestDate: '2025', institutionId: 7, institutionName: 'ONG'
    });
  });
});

