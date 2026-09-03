import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AdicionarQuestoesPayload, Avaliacao, AvaliacaoPayload, AvaliacaoVersao, VersaoGeracaoPayload } from '../../shared/models/avaliacao.model';
import { QuestaoResponseDTO } from '../../shared/models/questao.model';

interface PageResponse<T> {
  content: T[];
}

interface AvaliacaoQuestaoItemResponse {
  id: number;
  avaliacaoId: number;
  questao: QuestaoResponseDTO;
  ordem: number;
  peso?: number;
  createdAt: string;
}

interface AvaliacaoApiResponse extends Omit<Avaliacao, 'questoes'> {
  questoes: AvaliacaoQuestaoItemResponse[] | QuestaoResponseDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private readonly apiUrl = `${environment.apiUrl}/avaliacoes`;
  private readonly storageKey = 'plataforma-avaliacoes.avaliacoes';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Avaliacao[]> {
    return this.http.get<PageResponse<AvaliacaoApiResponse> | AvaliacaoApiResponse[]>(this.apiUrl).pipe(
      catchError(() => of(this.listarLocais())),
      // The backend lists avaliacoes through Spring Data Page, while local fallback is a plain array.
      // Normalize both shapes here so components can stay simple.
      map((response) => Array.isArray(response) ? response : (response.content ?? [])),
      map((avaliacoes) => avaliacoes.map((avaliacao) => this.normalizarAvaliacaoResposta(avaliacao)))
    );
  }

  obter(id: number): Observable<Avaliacao> {
    return this.http.get<AvaliacaoApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map((avaliacao) => this.normalizarAvaliacaoResposta(avaliacao)),
      catchError(() => {
        const avaliacao = this.listarLocais().find((item) => item.id === id);
        return avaliacao ? of(avaliacao) : throwError(() => new Error('Avaliacao nao encontrada.'));
      })
    );
  }

  criar(payload: AvaliacaoPayload): Observable<Avaliacao> {
    return this.http.post<AvaliacaoApiResponse>(this.apiUrl, payload).pipe(
      map((avaliacao) => this.normalizarAvaliacaoResposta(avaliacao)),
      catchError(() => of(this.criarLocal(payload)))
    );
  }

  adicionarQuestoes(avaliacao: Avaliacao, questoes: QuestaoResponseDTO[], blocoQuestaoIds?: number[]): Observable<Avaliacao> {
    const payload: AdicionarQuestoesPayload = {
      questaoIds: questoes.map((questao) => questao.id),
      blocoQuestaoIds
    };

    return this.http.post<AvaliacaoApiResponse>(`${this.apiUrl}/${avaliacao.id}/questoes`, payload).pipe(
      map((response) => this.normalizarAvaliacaoResposta(response)),
      catchError(() => of(this.adicionarQuestoesLocal(avaliacao.id, questoes)))
    );
  }

  removerQuestao(avaliacao: Avaliacao, questaoId: number): Observable<Avaliacao> {
    return this.http.delete<void>(`${this.apiUrl}/${avaliacao.id}/questoes/${questaoId}`).pipe(
      switchMap(() => this.obter(avaliacao.id)),
      catchError(() => of(this.removerQuestaoLocal(avaliacao.id, questaoId)))
    );
  }

  listarVersoes(avaliacaoId: number): Observable<AvaliacaoVersao[]> {
    return this.http.get<AvaliacaoVersao[]>(`${this.apiUrl}/${avaliacaoId}/versoes`);
  }

  gerarVersoes(avaliacaoId: number, payload: VersaoGeracaoPayload): Observable<AvaliacaoVersao[]> {
    return this.http.post<AvaliacaoVersao[]>(`${this.apiUrl}/${avaliacaoId}/versoes`, payload);
  }

  consultarVersaoPorCodigo(codigo: string): Observable<AvaliacaoVersao> {
    return this.http.get<AvaliacaoVersao>(`${this.apiUrl}/versoes/${codigo}`);
  }

  private normalizarAvaliacaoResposta(avaliacao: AvaliacaoApiResponse | Avaliacao): Avaliacao {
    const questoes = (avaliacao.questoes || []).map((item) => 'questao' in item ? item.questao : item);

    return {
      ...avaliacao,
      status: avaliacao.status || 'RASCUNHO',
      questoes
    };
  }

  private listarLocais(): Avaliacao[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Avaliacao[];
    } catch {
      return [];
    }
  }

  private salvarLocais(avaliacoes: Avaliacao[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(avaliacoes));
  }

  private criarLocal(payload: AvaliacaoPayload): Avaliacao {
    const avaliacoes = this.listarLocais();
    const now = new Date().toISOString();
    const avaliacao: Avaliacao = {
      id: Date.now(),
      titulo: payload.titulo,
      disciplinaId: Number(payload.disciplinaId),
      serieId: Number(payload.serieId),
      periodo: payload.periodo?.trim() || undefined,
      status: 'RASCUNHO',
      questoes: [],
      createdAt: now,
      updatedAt: now
    };

    this.salvarLocais([avaliacao, ...avaliacoes]);
    return avaliacao;
  }

  private adicionarQuestoesLocal(avaliacaoId: number, questoes: QuestaoResponseDTO[]): Avaliacao {
    const avaliacoes = this.listarLocais();
    const index = avaliacoes.findIndex((item) => item.id === avaliacaoId);
    if (index < 0) {
      throw new Error('Avaliacao nao encontrada.');
    }

    const atuais = avaliacoes[index].questoes || [];
    const novas = questoes.filter((questao) => !atuais.some((atual) => atual.id === questao.id));
    avaliacoes[index] = {
      ...avaliacoes[index],
      questoes: [...atuais, ...novas],
      updatedAt: new Date().toISOString()
    };

    this.salvarLocais(avaliacoes);
    return avaliacoes[index];
  }

  private removerQuestaoLocal(avaliacaoId: number, questaoId: number): Avaliacao {
    const avaliacoes = this.listarLocais();
    const index = avaliacoes.findIndex((item) => item.id === avaliacaoId);
    if (index < 0) {
      throw new Error('Avaliacao nao encontrada.');
    }

    avaliacoes[index] = {
      ...avaliacoes[index],
      questoes: (avaliacoes[index].questoes || []).filter((questao) => questao.id !== questaoId),
      updatedAt: new Date().toISOString()
    };

    this.salvarLocais(avaliacoes);
    return avaliacoes[index];
  }
}
