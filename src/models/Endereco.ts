// Este arquivo define os "modelos" (tipos) relacionados a endereços

// Interface para criar um novo endereço
export interface Endereco {
  id?: number;
  rua: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
}

// Interface para retornar dados do endereço
export interface EnderecoResponse {
  id: number;
  rua: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
}

