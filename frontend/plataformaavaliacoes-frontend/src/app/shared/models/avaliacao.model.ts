import { QuestaoResponseDTO } from './questao.model';

export type AvaliacaoStatus = 'RASCUNHO' | 'PRONTA' | 'ARQUIVADA';

export interface Avaliacao {
  id: number;
  titulo: string;
  disciplinaId: number;
  serieId: number;
  escolaId?: number;
  professorId?: number;
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
  escolaId?: number;
  professorId?: number;
  periodo?: string;
}

export interface GabaritoItem {
  numeroQuestao: number;
  questaoId: number;
  letraCorreta: string;
  ordemAlternativasJson: string;
}

export interface AvaliacaoVersao {
  id: number;
  codigo: string;
  createdAt: string;
  gabarito: GabaritoItem[];
}

export interface VersaoGeracaoPayload {
  quantidadeVersoes: number;
  embaralharQuestoes?: boolean;
  embaralharAlternativas?: boolean;
}

export interface AdicionarQuestoesPayload {
  questaoIds: number[];
  blocoQuestaoIds?: number[];
}
