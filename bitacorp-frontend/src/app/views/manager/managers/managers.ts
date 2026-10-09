import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BinnacleService } from '../../../services/binnacle.service';
import { TokenService } from '../../../services/token.service';
import { BinnacleResponse } from '../../../models/binnacle.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-managers',
  styleUrl: './managers.scss',
  templateUrl: './managers.html',
})
export class Managers implements OnInit {
  activeTab: 'inicio' | 'historial' = 'inicio';
  searchQuery = '';
  loading = false;
  error: string | null = null;

  bitacorasInicio: Array<{ id: string; titulo: string; autor: string; fecha: string; descripcion: string; _id?: number }> = [];
  bitacorasHistorial: Array<{ id: string; titulo: string; autor: string; fecha: string; descripcion: string; estado: string; _id?: number }> = [];

  constructor(private router: Router, private binnacle: BinnacleService, private token: TokenService) {}

  ngOnInit(): void {
    this.loadAvailable();
    this.loadHistory();
  }

  setTab(tab: 'inicio' | 'historial'): void {
    this.activeTab = tab;
    if (tab === 'inicio') this.loadAvailable();
    if (tab === 'historial') this.loadHistory();
  }

  setSearch(q: string): void {
    this.searchQuery = q;
    if (this.activeTab === 'inicio') this.loadAvailable();
    else this.loadHistory();
  }

  private loadAvailable(): void {
    this.loading = true;
    this.binnacle.available(this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.loading = false;
        this.bitacorasInicio = (res.data || []).map((b: BinnacleResponse) => ({
          id: String(b.id_binnacle),
          titulo: b.title || '',
          autor: b.user_email || '',
          fecha: b.creation_date || b.date_event || '',
          descripcion: b.descriptions || '',
          _id: b.id_binnacle
        }));
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error';
      }
    });
  }

  private loadHistory(): void {
    const user = this.token.getUser();
    if (!user) return;
    this.loading = true;
    this.binnacle.agentHistory(user.id, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.loading = false;
        this.bitacorasHistorial = (res.data || []).map((b: BinnacleResponse) => ({
          id: String(b.id_binnacle),
          titulo: b.title || '',
          autor: (b as any).author_email || (b as any).user_email || '',
          fecha: b.creation_date || b.date_event || '',
          descripcion: b.descriptions || '',
          estado: b.state || '',
          _id: b.id_binnacle
        }));
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error';
      }
    });
  }

  tomarCasoDirecto(event: Event, id: string): void {
    event.stopPropagation();
    const user = this.token.getUser();
    const item = this.bitacorasInicio.find((b) => b.id === id);
    if (!user || !item?._id) return;
    this.binnacle.takeCase(item._id, user.id).subscribe({
      next: () => {
        this.loadAvailable();
        this.loadHistory();
        this.activeTab = 'historial';
      },
      error: (err) => (this.error = err?.error?.message || 'No se pudo tomar el caso')
    });
  }

  verBitacoraInicio(id: string): void {
    const item = this.bitacorasInicio.find((b) => b.id === id);
    this.router.navigate(['/managers/ver-inicio', item?._id ?? id]);
  }

  verBitacoraHistorial(id: string): void {
    const item = this.bitacorasHistorial.find((b) => b.id === id);
    this.router.navigate(['/managers/ver-historial', item?._id ?? id]);
  }

  verPerfilAutor(event: Event, autorNombre: string): void {
    event.stopPropagation();
    this.router.navigate(['/managers/denunciante-perfil']);
  }
}
