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
    // CORREÇÃO: Mockar o encadeamento .insert().returning()
    const mockReturning = jest.fn().mockResolvedValue([{ id: 123 }]);
    const mockInsert = jest.fn().mockReturnValue({ returning: mockReturning });

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

    // Configura o mock para responder corretamente dependendo da tabela
    mockedDb.mockImplementation((arg: any) => {
      if (arg === 'ENDERECOS') {
        return {
          insert: mockInsert,
          where: jest.fn().mockReturnValue({ first: mockFirst })
        } as any;
      }
      return {} as any;
    });
    
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
      rua: 'Rua Nova'
    });
  });

  // (Os outros testes permanecem iguais, vou omitir para brevidade mas você deve manter o arquivo completo se já tiver as outras partes)
  // Se quiser o arquivo INTEIRO para garantir, me avise.
  // ... (manter testes de busca, atualização e delete) ...
});