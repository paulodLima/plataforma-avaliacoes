export type TipoQuestao = 'OBJETIVA' | 'VERDADEIRO_FALSO' | 'DISCURSIVA';
export type Dificuldade = 'FACIL' | 'MEDIA' | 'DIFICIL';

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface AlternativaResponseDTO {
  id: number;
  texto: string;
  correta: boolean;
  ordem: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestaoResponseDTO {
  id: number;
  blocoQuestaoId?: number;
  disciplinaId: number;
  serieId: number;
  assuntoId?: number;
  enunciado: string;
  tipo: TipoQuestao;
  dificuldade: Dificuldade;
  valorPadrao?: number;
  explicacao?: string;
  ativo: boolean;
  alternativas: AlternativaResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface AlternativaRequestDTO {
  texto: string;
  correta: boolean;
}

export interface QuestaoRequestDTO {
  blocoQuestaoId?: number;
  disciplinaId: number;
  serieId: number;
  assuntoId?: number;
  enunciado: string;
  tipo: TipoQuestao;
  dificuldade: Dificuldade;
  valorPadrao?: number;
  explicacao?: string;
  alternativas: AlternativaRequestDTO[];
}
