import { Injectable } from '@angular/core';
import { LoggedUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private TOKEN_KEY = 'bitacorp_token';
  private USER_KEY = 'bitacorp_user';

  setToken(token: string): void { localStorage.setItem(this.TOKEN_KEY, token); }
  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  removeToken(): void { localStorage.removeItem(this.TOKEN_KEY); }

  setUser(user: LoggedUser): void { localStorage.setItem(this.USER_KEY, JSON.stringify(user)); }
  getUser(): LoggedUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) as LoggedUser : null;
  }
  removeUser(): void { localStorage.removeItem(this.USER_KEY); }

  clear(): void { this.removeToken(); this.removeUser(); }
  isAuthenticated(): boolean { return !!this.getToken(); }
}