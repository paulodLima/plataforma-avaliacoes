import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Professor } from '../../shared/models/professor.model';

export interface LoginPayload {
  login: string;
  senha?: string;
}

export interface AuthResponse {
  token: string;
  professor: Professor;
}

export interface MeResponse {
  professor: Professor;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly tokenKey = 'pa_token';
  private readonly userKey = 'pa_user';

  private readonly currentUserSignal = signal<Professor | null>(this.getStoredUser());
  readonly currentUser = this.currentUserSignal.asReadonly();

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => this.handleAuthentication(response.token, response.professor))
    );
  }

  loadMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        this.storeUser(response.professor);
        this.currentUserSignal.set(response.professor);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuthentication(token: string, user: Professor): void {
    localStorage.setItem(this.tokenKey, token);
    this.storeUser(user);
    this.currentUserSignal.set(user);
  }

  private storeUser(user: Professor): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getStoredUser(): Professor | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
