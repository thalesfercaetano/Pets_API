export interface Usuario {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface UsuarioResponse {
  id: number;
  name: string;
  email: string;
}

