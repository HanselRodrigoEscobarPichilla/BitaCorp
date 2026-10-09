import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE } from './api.config';
import { LoginRequest, LoginResponse, RegisterWhistleblowerPayload } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private token: TokenService) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE}/auth/login`, data).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          this.token.setToken(res.token);
          this.token.setUser(res.user);
        }
      })
    );
  }

  registerWhistleblower(payload: RegisterWhistleblowerPayload): Observable<any> {
    return this.http.post<any>(`${API_BASE}/auth/register`, payload);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${API_BASE}/auth/logout`, {}).pipe(
      tap(() => this.token.clear())
    );
  }
}