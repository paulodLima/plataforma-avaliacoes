import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Assunto, AssuntoFiltros, AssuntoPayload } from '../../shared/models/assunto.model';

@Injectable({
  providedIn: 'root'
})
export class AssuntoService {
  private readonly apiUrl = `${environment.apiUrl}/assuntos`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: AssuntoFiltros = {}): Observable<Assunto[]> {
    let params = new HttpParams();

    if (filtros.disciplinaId) {
      params = params.set('disciplinaId', filtros.disciplinaId);
    }

    if (filtros.serieId) {
      params = params.set('serieId', filtros.serieId);
    }

    return this.http.get<Assunto[]>(this.apiUrl, { params });
  }

  criar(payload: AssuntoPayload): Observable<Assunto> {
    return this.http.post<Assunto>(this.apiUrl, payload);
  }

  atualizar(id: number, payload: AssuntoPayload): Observable<Assunto> {
    return this.http.put<Assunto>(`${this.apiUrl}/${id}`, payload);
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
