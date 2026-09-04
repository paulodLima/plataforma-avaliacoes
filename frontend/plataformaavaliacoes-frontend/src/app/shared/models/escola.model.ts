export interface Escola {
  id: number;
  nome: string;
  sigla?: string;
  logoUrl?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  site?: string;
  observacoesCabecalho?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EscolaPayload {
  nome: string;
  sigla?: string;
  logoUrl?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  site?: string;
  observacoesCabecalho?: string;
}
