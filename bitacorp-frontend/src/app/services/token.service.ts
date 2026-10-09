import { Injectable } from '@angular/core';
import { LoggedUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private TOKEN_KEY = 'bitacorp_token';
  private USER_KEY = 'bitacorp_user';

  private get storage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }

  setToken(token: string): void { this.storage?.setItem(this.TOKEN_KEY, token); }
  getToken(): string | null { return this.storage?.getItem(this.TOKEN_KEY) ?? null; }
  removeToken(): void { this.storage?.removeItem(this.TOKEN_KEY); }

  setUser(user: LoggedUser): void { this.storage?.setItem(this.USER_KEY, JSON.stringify(user)); }
  getUser(): LoggedUser | null {
    const raw = this.storage?.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) as LoggedUser : null;
  }
  removeUser(): void { this.storage?.removeItem(this.USER_KEY); }

  clear(): void { this.removeToken(); this.removeUser(); }
  isAuthenticated(): boolean { return !!this.getToken(); }
}
