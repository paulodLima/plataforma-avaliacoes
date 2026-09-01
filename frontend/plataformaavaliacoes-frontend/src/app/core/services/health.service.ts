import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ApiStatusResponse {
  status: string;
  service: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getBackendStatus(): Observable<ApiStatusResponse> {
    return this.http.get<ApiStatusResponse>(`${this.apiUrl}/health`);
  }
}
