export interface Titulo {
  id: number;
  descricao: string;
  valor: number;
  vencimento: string;
  status: 'pendente' | 'pago' | 'atrasado';
  createdAt?: string;
  updatedAt?: string;
}

export interface TituloFormData {
  descricao: string;
  valor: number;
  vencimento: string;
  status: 'pendente' | 'pago' | 'atrasado';
}
