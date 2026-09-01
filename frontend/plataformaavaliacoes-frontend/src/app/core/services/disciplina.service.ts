import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Disciplina, DisciplinaPayload } from '../../shared/models/disciplina.model';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private readonly apiUrl = `${environment.apiUrl}/disciplinas`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(this.apiUrl);
  }

  criar(payload: DisciplinaPayload): Observable<Disciplina> {
    return this.http.post<Disciplina>(this.apiUrl, payload);
  }

  atualizar(id: number, payload: DisciplinaPayload): Observable<Disciplina> {
    return this.http.put<Disciplina>(`${this.apiUrl}/${id}`, payload);
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
