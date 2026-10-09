import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api.config';
import { UserResponse, WhistleblowerProfile, ManagerRegisterPayload, AdminRegisterPayload } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  listUsers(): Observable<{ success: boolean; data: UserResponse[] }> {
    return this.http.get<{ success: boolean; data: UserResponse[] }>(`${API_BASE}/users`);
  }

  getUsersByRole(role: 'whistleblower' | 'manager' | 'admin', search?: string): Observable<{ success: boolean; data: UserResponse[] }> {
    let params = new HttpParams();
    if (search && search.trim()) params = params.set('search', search.trim());
    return this.http.get<{ success: boolean; data: UserResponse[] }>(`${API_BASE}/users/role/${role}`, { params });
  }

  registerWhistleblower(body: any): Observable<any> {
    return this.http.post<any>(`${API_BASE}/users/register/whistleblower`, body);
  }

  registerManager(body: ManagerRegisterPayload): Observable<any> {
    return this.http.post<any>(`${API_BASE}/users/register/manager`, body);
  }

  registerAdmin(body: AdminRegisterPayload): Observable<any> {
    return this.http.post<any>(`${API_BASE}/users/register/admin`, body);
  }

  getUserProfile(id: number): Observable<{ success: boolean; data: UserResponse }> {
    return this.http.get<{ success: boolean; data: UserResponse }>(`${API_BASE}/users/profile/${id}`);
  }

  updateProfile(id: number, body: Partial<UserResponse>): Observable<any> {
    return this.http.put<any>(`${API_BASE}/users/profile/${id}`, body);
  }

  whistleblowerForAgent(id: number): Observable<{ success: boolean; data: WhistleblowerProfile }> {
    return this.http.get<{ success: boolean; data: WhistleblowerProfile }>(`${API_BASE}/users/whistleblower/${id}`);
  }

  updateUser(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${API_BASE}/users/${id}`, body);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${API_BASE}/users/${id}`);
  }
}