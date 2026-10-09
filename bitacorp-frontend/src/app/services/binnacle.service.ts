import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api.config';
import { BinnacleResponse } from '../models/binnacle.model';

@Injectable({ providedIn: 'root' })
export class BinnacleService {
  constructor(private http: HttpClient) {}

  listAll(): Observable<{ success: boolean; data: BinnacleResponse[] }> {
    return this.http.get<{ success: boolean; data: BinnacleResponse[] }>(`${API_BASE}/binnacles`);
  }

  getById(id: number): Observable<{ success: boolean; data: BinnacleResponse }> {
    return this.http.get<{ success: boolean; data: BinnacleResponse }>(`${API_BASE}/binnacles/${id}`);
  }

  getUserBinnacles(userId: number, search?: string): Observable<{ success: boolean; data: BinnacleResponse[] }> {
    let params = new HttpParams();
    if (search && search.trim()) params = params.set('search', search.trim());
    return this.http.get<{ success: boolean; data: BinnacleResponse[] }>(`${API_BASE}/binnacles/user/${userId}`, { params });
  }

  create(formData: FormData): Observable<any> {
    return this.http.post<any>(`${API_BASE}/binnacles`, formData);
  }

  update(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${API_BASE}/binnacles/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${API_BASE}/binnacles/${id}`);
  }

  available(search?: string): Observable<{ success: boolean; data: BinnacleResponse[] }> {
    let params = new HttpParams();
    if (search && search.trim()) params = params.set('search', search.trim());
    return this.http.get<{ success: boolean; data: BinnacleResponse[] }>(`${API_BASE}/binnacles/agent/available`, { params });
  }

  viewDetails(id: number): Observable<{ success: boolean; data: BinnacleResponse }> {
    return this.http.get<{ success: boolean; data: BinnacleResponse }>(`${API_BASE}/binnacles/agent/view/${id}`);
  }

  takeCase(id: number, managerId: number): Observable<any> {
    return this.http.put<any>(`${API_BASE}/binnacles/${id}/take`, { managerId });
  }

  cancelCase(id: number, managerId: number): Observable<any> {
    return this.http.put<any>(`${API_BASE}/binnacles/${id}/cancel`, { managerId });
  }

  resolveCase(id: number, managerId: number): Observable<any> {
    return this.http.put<any>(`${API_BASE}/binnacles/${id}/resolve`, { managerId });
  }

  agentHistory(managerId: number, search?: string): Observable<{ success: boolean; data: BinnacleResponse[] }> {
    let params = new HttpParams();
    if (search && search.trim()) params = params.set('search', search.trim());
    return this.http.get<{ success: boolean; data: BinnacleResponse[] }>(`${API_BASE}/binnacles/agent/history/${managerId}`, { params });
  }
}