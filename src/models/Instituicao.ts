// Este arquivo define os "modelos" (tipos) relacionados a instituições

// Interface para criar uma nova instituição
export interface Instituicao {
  id?: number;
  nome: string;
  cnpj?: string;
  email: string;
  telefone?: string;
  link_site?: string;
  descricao?: string;
  endereco_id?: number;
}

// Interface para retornar dados da instituição
export interface InstituicaoResponse {
  id: number;
  nome: string;
  cnpj?: string;
  email: string;
  telefone?: string;
  link_site?: string;
  descricao?: string;
  endereco_id?: number;
  data_cadastro?: string;
}

