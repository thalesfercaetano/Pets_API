// Este arquivo define os modelos relacionados ao sistema de matches estilo Tinder

// Interface para um swipe (like ou pass)
export interface Swipe {
  id?: number;
  usuario_id?: number;     
  instituicao_id?: number;  
  pet_id: number;
  tipo: "like" | "pass";
  data_swipe?: Date;
}

export interface SwipeRequest {
  pet_id: number;
  tipo: "like" | "pass";
}

export interface Match {
  id?: number;
  usuario_id: number;
  instituicao_id: number;
  pet_id: number;
  status?: "ativo" | "conversando" | "adotado" | "cancelado";
  data_match?: Date;
  ultima_interacao?: Date;
}

export interface MatchDetalhado {
  id: number;
  usuario_id: number;
  usuario_nome: string | null;
  usuario_email: string | null;
  instituicao_id: number;
  instituicao_nome: string | null;
  pet_id: number;
  pet_nome: string | null;
  pet_especie: string | null;
  pet_raca: string | null;
  pet_cor: string | null;
  status: string;
  data_match: Date;
  ultima_interacao: Date;
}

export interface PetPerfil {
  id: number;
  nome: string;
  especie: string;
  raca: string | null;
  sexo: string;
  idade_aproximada: string | null;
  porte: string | null;
  cor: string | null;
  vacinado: boolean;
  castrado: boolean;
  descricao_saude: string | null;
  historia: string | null;
  instituicao_id: number;
  instituicao_nome: string | null;
  data_cadastro: Date;
}

export interface UsuarioPerfil {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  data_cadastro: Date;
  total_adocoes: number; 
}

export interface SwipeResponse {
  match: boolean;
  match_id?: number;
  message: string;
}