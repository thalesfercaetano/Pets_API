// Este arquivo define os "modelos" (tipos) relacionados a adoções
// As interfaces definem quais campos um objeto deve ter e de que tipo são

// Interface para uma solicitação de adoção
export interface Adocao {
  id?: number;              
  usuario_id: number;       
  pet_id: number;           
  status?: string;          
  data_solicitacao?: Date;  
}

// Interface para representar os dados completos de uma solicitação de adoção
export interface AdocaoDetalhada {
  id: number;
  petId: number;
  petName: string | null;
  petSpecies: string | null;
  status: string;
  requestDate: Date;
  institutionId: number | null;
  institutionName: string | null;
}