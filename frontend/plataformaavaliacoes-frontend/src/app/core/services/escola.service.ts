import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Escola, EscolaPayload } from '../../shared/models/escola.model';

interface PageResponse<T> {
  content: T[];
}

@Injectable({
  providedIn: 'root'
})
export class EscolaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/escolas`;

  listar(): Observable<Escola[]> {
    return this.http.get<PageResponse<Escola> | Escola[]>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : (response.content ?? []))
    );
  }

  obter(id: number): Observable<Escola> {
    return this.http.get<Escola>(`${this.apiUrl}/${id}`);
  }

  criar(payload: EscolaPayload): Observable<Escola> {
    return this.http.post<Escola>(this.apiUrl, payload);
  }

  atualizar(id: number, payload: EscolaPayload): Observable<Escola> {
    return this.http.put<Escola>(`${this.apiUrl}/${id}`, payload);
  }
}
