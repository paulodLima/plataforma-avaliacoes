import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Serie, SeriePayload } from '../../shared/models/serie.model';

@Injectable({
  providedIn: 'root'
})
export class SerieService {
  private readonly apiUrl = `${environment.apiUrl}/series`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Serie[]> {
    return this.http.get<Serie[]>(this.apiUrl);
  }

  criar(payload: SeriePayload): Observable<Serie> {
    return this.http.post<Serie>(this.apiUrl, payload);
  }

  atualizar(id: number, payload: SeriePayload): Observable<Serie> {
    return this.http.put<Serie>(`${this.apiUrl}/${id}`, payload);
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
