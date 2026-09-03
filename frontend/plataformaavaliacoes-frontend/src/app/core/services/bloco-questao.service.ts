import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BlocoQuestao {
  id?: number;
  textoBase: string;
  anexoUrl: string;
  disciplinaId: number;
  serieId: number;
  assuntoId?: number;
  ativo?: boolean;
  questoes?: any[];
}

export interface PaginatedBlocoQuestao {
  content: BlocoQuestao[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class BlocoQuestaoService {
  private readonly apiUrl = `${environment.apiUrl}/blocos-questoes`;

  constructor(private http: HttpClient) {}

  findAll(page: number = 0, size: number = 10): Observable<PaginatedBlocoQuestao> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedBlocoQuestao>(this.apiUrl, { params });
  }

  findById(id: number): Observable<BlocoQuestao> {
    return this.http.get<BlocoQuestao>(`${this.apiUrl}/${id}`);
  }

  create(bloco: BlocoQuestao): Observable<BlocoQuestao> {
    return this.http.post<BlocoQuestao>(this.apiUrl, bloco);
  }

  update(id: number, bloco: BlocoQuestao): Observable<BlocoQuestao> {
    return this.http.put<BlocoQuestao>(`${this.apiUrl}/${id}`, bloco);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
