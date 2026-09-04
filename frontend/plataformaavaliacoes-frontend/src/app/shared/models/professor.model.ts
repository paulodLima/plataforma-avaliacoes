export interface Professor {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  escolaId: number;
  escolaNome?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessorPayload {
  nome: string;
  email: string;
  telefone?: string;
  senha?: string;
  escolaId: number;
}
