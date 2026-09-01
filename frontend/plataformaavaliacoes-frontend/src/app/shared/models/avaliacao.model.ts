import { QuestaoResponseDTO } from './questao.model';

export type AvaliacaoStatus = 'RASCUNHO' | 'PRONTA' | 'ARQUIVADA';

export interface Avaliacao {
  id: number;
  titulo: string;
  disciplinaId: number;
  serieId: number;
  periodo?: string;
  status: AvaliacaoStatus;
  questoes: QuestaoResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface AvaliacaoPayload {
  titulo: string;
  disciplinaId: number;
  serieId: number;
  periodo?: string;
}

export interface AdicionarQuestoesPayload {
  questaoIds: number[];
}
