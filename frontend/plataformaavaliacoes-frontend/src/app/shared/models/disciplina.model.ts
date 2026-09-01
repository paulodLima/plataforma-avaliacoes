export interface Disciplina {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DisciplinaPayload {
  nome: string;
  ativo?: boolean;
}
