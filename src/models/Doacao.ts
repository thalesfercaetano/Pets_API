// Este arquivo define os "modelos" (tipos) relacionados a doações
// As interfaces aqui ajudam a tipar os dados que trafegam entre as camadas da aplicação

// Interface para representar os dados necessários ao registrar uma doação
export interface Doacao {
  usuario_id: number;
  instituicao_id: number;
  tipo_doacao_id: number;
  quantidade: number;
  status_entrega?: string;
}

// Interface com os principais campos retornados após salvar uma doação
export interface DoacaoResponse {
  id: number;
  usuarioId: number;
  instituicaoId: number;
  tipoDoacaoId: number;
  quantidade: number;
  dataDoacao: Date;
  statusEntrega: string | null;
}

// Interface para representar os dados completos de uma doação listada
export interface DoacaoDetalhada {
  id: number;
  usuarioId: number;
  usuarioNome: string | null;
  instituicaoId: number;
  tipoDoacaoId: number;
  tipoDoacaoNome: string | null;
  quantidade: number;
  dataDoacao: Date;
  statusEntrega: string | null;
}

