import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Page, QuestaoRequestDTO, QuestaoResponseDTO, Dificuldade } from '../../shared/models/questao.model';

@Injectable({
  providedIn: 'root'
})
export class QuestaoService {
  private readonly apiUrl = `${environment.apiUrl}/questoes`;

  constructor(private readonly http: HttpClient) {}

  listar(
    disciplinaId?: number,
    serieId?: number,
    assuntoId?: number,
    dificuldade?: Dificuldade,
    page: number = 0,
    size: number = 20
  ): Observable<Page<QuestaoResponseDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (disciplinaId) {
      params = params.set('disciplinaId', disciplinaId.toString());
    }
    if (serieId) {
      params = params.set('serieId', serieId.toString());
    }
    if (assuntoId) {
      params = params.set('assuntoId', assuntoId.toString());
    }
    if (dificuldade) {
      params = params.set('dificuldade', dificuldade);
    }

    return this.http.get<Page<QuestaoResponseDTO>>(this.apiUrl, { params });
  }

  obter(id: number): Observable<QuestaoResponseDTO> {
    return this.http.get<QuestaoResponseDTO>(`${this.apiUrl}/${id}`);
  }

  criar(payload: QuestaoRequestDTO): Observable<QuestaoResponseDTO> {
    return this.http.post<QuestaoResponseDTO>(this.apiUrl, payload);
  }

  atualizar(id: number, payload: QuestaoRequestDTO): Observable<QuestaoResponseDTO> {
    return this.http.put<QuestaoResponseDTO>(`${this.apiUrl}/${id}`, payload);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
