import { DoacaoBusiness } from '../../src/business/doacaoBusiness';
import db from '../../src/db';

jest.mock('../../src/db');

const mockedDb = db as jest.MockedFunction<typeof db>;
const doacaoBusiness = new DoacaoBusiness();

describe('DoacaoBusiness', () => {
  beforeEach(() => jest.resetAllMocks());

  it('registrarDoacao valida entidades e retorna resumo', async () => {
    const firstUsuario = jest.fn().mockResolvedValue({ id: 1 });
    const firstInstituicao = jest.fn().mockResolvedValue({ id: 2 });
    const firstTipo = jest.fn().mockResolvedValue({ id: 3 });
    const returning = jest.fn().mockResolvedValue([{ id: 10 }]);
    const insert = jest.fn().mockReturnValue({ returning });
    const firstDoacao = jest.fn().mockResolvedValue({ id: 10, usuario_id: 1, instituicao_id: 2, tipo_doacao_id: 3, quantidade: 5, data_doacao: '2025', status_entrega: 'pendente' });
    mockedDb
      .mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstUsuario }) } as any)
      .mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstInstituicao }) } as any)
      .mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstTipo }) } as any)
      .mockReturnValueOnce({ insert } as any)
      .mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstDoacao }) } as any);
    const res = await doacaoBusiness.registrarDoacao({ usuario_id: 1, instituicao_id: 2, tipo_doacao_id: 3, quantidade: 5 } as any);
    expect(res).toEqual({
      id: 10, usuarioId: 1, instituicaoId: 2, tipoDoacaoId: 3, quantidade: 5, dataDoacao: '2025', statusEntrega: 'pendente'
    });
  });

  it('registrarDoacao lança erro quando usuário não existe', async () => {
    const firstUsuarioNotFound = jest.fn().mockResolvedValue(undefined);
    mockedDb.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstUsuarioNotFound }) } as any);
    await expect(doacaoBusiness.registrarDoacao({ usuario_id: 999, instituicao_id: 2, tipo_doacao_id: 3, quantidade: 1 } as any))
      .rejects.toThrow('Usuário não encontrado');
  });

  it('listarDoacoesPorInstituicao retorna instituicaoExiste=false quando não há instituição', async () => {
    const firstInstNotFound = jest.fn().mockResolvedValue(undefined);
    mockedDb.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstInstNotFound }) } as any);
    const res = await doacaoBusiness.listarDoacoesPorInstituicao(999);
    expect(res).toEqual({ instituicaoExiste: false, doacoes: [] });
  });

  it('listarDoacoesPorInstituicao retorna lista formatada quando há instituição', async () => {
    const firstInst = jest.fn().mockResolvedValue({ id: 2 });
    const select = jest.fn().mockResolvedValue([{
      id: 1, usuario_id: 1, instituicao_id: 2, tipo_doacao_id: 3, quantidade: 5, data_doacao: '2025', status_entrega: 'pendente', usuario_nome: 'U', tipo_doacao_nome: 'Ração'
    }]);
    mockedDb
      .mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: firstInst }) } as any)
      .mockReturnValueOnce({ leftJoin: jest.fn().mockReturnValue({ leftJoin: jest.fn().mockReturnValue({ where: jest.fn().mockReturnValue({ orderBy: jest.fn().mockReturnValue({ select }) }) }) }) } as any);
    const res = await doacaoBusiness.listarDoacoesPorInstituicao(2);
    expect(res.instituicaoExiste).toBe(true);
    expect(res.doacoes[0]).toEqual({
      id: 1, usuarioId: 1, usuarioNome: 'U', instituicaoId: 2, tipoDoacaoId: 3, tipoDoacaoNome: 'Ração', quantidade: 5, dataDoacao: '2025', statusEntrega: 'pendente'
    });
  });
});

