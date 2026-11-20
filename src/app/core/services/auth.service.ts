import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AuthTokensResponse,
  AuthUser,
  LoginRequest,
  LogoutResponse,
  RegisterRequest,
} from '../models/auth.model';

const AUTH_API_URL = 'http://localhost:3000/api/v1/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly accessToken = signal<string | null>(null);
  private refreshToken: string | null = null;

  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  register(request: RegisterRequest): Observable<AuthTokensResponse> {
    return this.http
      .post<AuthTokensResponse>(`${AUTH_API_URL}/register`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  login(request: LoginRequest): Observable<AuthTokensResponse> {
    return this.http
      .post<AuthTokensResponse>(`${AUTH_API_URL}/login`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): Observable<LogoutResponse> {
    if (!this.refreshToken) {
      throw new Error('Cannot log out without an active refresh token.');
    }

    return this.http
      .post<LogoutResponse>(`${AUTH_API_URL}/logout`, {
        refreshToken: this.refreshToken,
      })
      .pipe(tap(() => this.clearSession()));
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  private setSession(response: AuthTokensResponse): void {
    this.accessToken.set(response.accessToken);
    this.refreshToken = response.refreshToken;
    this.user.set(response.user);
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.refreshToken = null;
    this.user.set(null);
  }
}
