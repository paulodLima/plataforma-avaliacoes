export interface Serie {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeriePayload {
  nome: string;
  ativo?: boolean;
}
