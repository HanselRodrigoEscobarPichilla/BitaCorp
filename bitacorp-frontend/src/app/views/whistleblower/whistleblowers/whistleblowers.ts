import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BinnacleService } from '../../../services/binnacle.service';
import { TokenService } from '../../../services/token.service';
import { BinnacleResponse } from '../../../models/binnacle.model';

@Component({
  imports: [CommonModule, NgIf, NgFor],
  selector: 'app-whistleblowers',
  styleUrl: './whistleblowers.scss',
  templateUrl: './whistleblowers.html',
})
export class Whistleblowers implements OnInit {
  activeTab: 'inicio' | 'historial' = 'inicio';
  isCreating: boolean = false;
  searchQuery = '';
  loading = false;
  error: string | null = null;

  bitacoras: Array<{
    id: number;
    titulo: string;
    descripcion: string;
    estado: string;
    fechaCreacion: string;
  }> = [];

  constructor(private router: Router, private binnacle: BinnacleService, private token: TokenService) {}

  ngOnInit(): void {
    this.loadUserBinnacles();
  }

  setTab(tab: 'inicio' | 'historial'): void {
    this.activeTab = tab;
  }

  crearBitacora(): void {
    this.router.navigate(['/whistleblowers/crear']);
  }

  verBitacora(id: number): void {
    this.router.navigate(['/whistleblowers/ver', id]);
  }

  editarBitacora(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/whistleblowers/editar', id]);
  }

  setSearch(q: string): void {
    this.searchQuery = q;
    this.loadUserBinnacles();
  }

  private loadUserBinnacles(): void {
    const user = this.token.getUser();
    if (!user) return;
    this.loading = true;
    this.error = null;
    this.binnacle.getUserBinnacles(user.id, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.loading = false;
        this.bitacoras = (res.data || []).map((b: BinnacleResponse) => ({
          id: b.id_binnacle!,
          titulo: b.descriptions || 'Sin título',
          descripcion: b.descriptions || '',
          estado: b.state || 'Pendiente',
          fechaCreacion: b.date_event || ''
        }));
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar bitácoras';
      }
    });
  }

  eliminarBitacora(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('¿Eliminar bitácora?')) return;
    this.binnacle.delete(id).subscribe({
      next: () => this.loadUserBinnacles(),
      error: (err) => (this.error = err?.error?.message || 'Error al eliminar')
    });
  }
}
