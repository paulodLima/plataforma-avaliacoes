export interface Referencia {
  id: number;
  nome: string;
}

export interface Assunto {
  id: number;
  nome: string;
  disciplina: Referencia;
  serie: Referencia;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssuntoPayload {
  nome: string;
  disciplinaId: number;
  serieId: number;
  ativo?: boolean;
}

export interface AssuntoFiltros {
  disciplinaId?: number;
  serieId?: number;
}
