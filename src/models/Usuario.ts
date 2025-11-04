// Este arquivo define os "modelos" (tipos) relacionados a usuários

// Interface para criar um novo usuário
export interface Usuario {
  id?: number;        
  name: string;      
  email: string;      
  password: string;   
}

// Interface para fazer login
export interface UsuarioLogin {
  email: string;      
  password: string;   
}

// Interface para retornar dados do usuário (sem a senha, por segurança!)
export interface UsuarioResponse {
  id: number;        
  name: string;       
  email: string;     
}

