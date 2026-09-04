import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Professor, ProfessorPayload } from '../../shared/models/professor.model';

interface PageResponse<T> {
  content: T[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/professores`;

  listar(): Observable<Professor[]> {
    return this.http.get<PageResponse<Professor> | Professor[]>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : (response.content ?? []))
    );
  }

  obter(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/${id}`);
  }

  criar(payload: ProfessorPayload): Observable<Professor> {
    return this.http.post<Professor>(this.apiUrl, payload);
  }

  atualizar(id: number, payload: ProfessorPayload): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/${id}`, payload);
  }
}
