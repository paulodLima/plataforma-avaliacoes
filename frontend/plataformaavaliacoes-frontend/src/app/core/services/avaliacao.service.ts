import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AdicionarQuestoesPayload, Avaliacao, AvaliacaoPayload } from '../../shared/models/avaliacao.model';
import { QuestaoResponseDTO } from '../../shared/models/questao.model';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private readonly apiUrl = `${environment.apiUrl}/avaliacoes`;
  private readonly storageKey = 'plataforma-avaliacoes.avaliacoes';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(this.apiUrl).pipe(
      catchError(() => of(this.listarLocais()))
    );
  }

  obter(id: number): Observable<Avaliacao> {
    return this.http.get<Avaliacao>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const avaliacao = this.listarLocais().find((item) => item.id === id);
        return avaliacao ? of(avaliacao) : throwError(() => new Error('Avaliacao nao encontrada.'));
      })
    );
  }

  criar(payload: AvaliacaoPayload): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(this.apiUrl, payload).pipe(
      catchError(() => of(this.criarLocal(payload)))
    );
  }

  adicionarQuestoes(avaliacao: Avaliacao, questoes: QuestaoResponseDTO[]): Observable<Avaliacao> {
    const payload: AdicionarQuestoesPayload = {
      questaoIds: questoes.map((questao) => questao.id)
    };

    return this.http.post<Avaliacao>(`${this.apiUrl}/${avaliacao.id}/questoes`, payload).pipe(
      catchError(() => of(this.adicionarQuestoesLocal(avaliacao.id, questoes)))
    );
  }

  removerQuestao(avaliacao: Avaliacao, questaoId: number): Observable<Avaliacao> {
    return this.http.delete<Avaliacao>(`${this.apiUrl}/${avaliacao.id}/questoes/${questaoId}`).pipe(
      catchError(() => of(this.removerQuestaoLocal(avaliacao.id, questaoId)))
    );
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
