// Este arquivo define os "modelos" (tipos) relacionados a resgates

// Interface para um reporte de resgate
export interface Resgate {
  id?: number;          
  descricao: string;     
  localizacao: string;  
  status?: string;      
  data_report?: Date;   
}
