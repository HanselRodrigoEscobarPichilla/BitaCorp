import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BinnacleService } from '../../../services/binnacle.service';
import { UsersService } from '../../../services/users.service';
import { TokenService } from '../../../services/token.service';
import { BinnacleResponse } from '../../../models/binnacle.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-manager-binnacles-check',
  styleUrl: './manager-binnacles-check.scss',
  templateUrl: './manager-binnacles-check.html',
})
export class ManagerBinnaclesCheck implements OnInit {
  contextMode: 'inicio' | 'historial' = 'inicio';
  id!: number;
  authorId?: number;
  loading = false;
  error: string | null = null;

  binnacleData = {
    titulo: '',
    autor: '',
    fecha: '',
    descripcion: '',
    efectos: '',
    lugar: '',
    fechaSucedido: '',
    tipoAgresor: '',
    descripcionAgresor: '',
    estado: 'En proceso',
    evidences: [] as Array<{ file_path: string }>
  };

  estadosList: string[] = ['En proceso', 'Resuelto'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private binnacle: BinnacleService,
    private users: UsersService,
    private token: TokenService
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('ver-historial')) this.contextMode = 'historial';
    else this.contextMode = 'inicio';
    const param = this.route.snapshot.paramMap.get('id');
    this.id = Number(param);
    if (!isNaN(this.id)) this.load();
  }

  load(): void {
    this.loading = true;
    this.binnacle.viewDetails(this.id).subscribe({
      next: (res) => {
        this.loading = false;
        const b: BinnacleResponse = res.data;
        this.authorId = b.users_id;
        this.binnacleData.titulo = b.descriptions || '';
        this.binnacleData.autor = b.user_email || (b as any).author_email || '';
        this.binnacleData.fecha = b.date_event || '';
        this.binnacleData.descripcion = b.descriptions || '';
        this.binnacleData.efectos = b.effects || '';
        this.binnacleData.lugar = b.place || '';
        this.binnacleData.fechaSucedido = b.date_event || '';
        this.binnacleData.estado = b.state || (this.contextMode === 'historial' ? 'En proceso' : '');
        if (b.aggressors?.length) {
          this.binnacleData.tipoAgresor = b.aggressors[0].aggressors_type || '';
          this.binnacleData.descripcionAgresor = b.aggressors[0].description_aggressors || '';
        }
        this.binnacleData.evidences = b.evidences || [];
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error';
      }
    });
  }

  tomarCaso(): void {
    const user = this.token.getUser();
    if (!user) return;
    this.binnacle.takeCase(this.id, user.id).subscribe({
      next: () => this.router.navigate(['/managers']),
      error: (err) => (this.error = err?.error?.message || 'No se pudo tomar el caso')
    });
  }

  cancelarCaso(): void {
    const user = this.token.getUser();
    if (!user) return;
    this.binnacle.cancelCase(this.id, user.id).subscribe({
      next: () => this.router.navigate(['/managers']),
      error: (err) => (this.error = err?.error?.message || 'Error')
    });
  }

  resolverCaso(): void {
    const user = this.token.getUser();
    if (!user) return;
    if (this.binnacleData.estado === 'Resuelto') {
      this.binnacle.resolveCase(this.id, user.id).subscribe({
        next: () => this.router.navigate(['/managers']),
        error: (err) => (this.error = err?.error?.message || 'Error')
      });
    }
  }

  salir(): void {
    this.router.navigate(['/managers']);
  }

  verPerfilAutor(): void {
    if (this.authorId) {
      this.router.navigate(['/managers/denunciante-perfil'], { queryParams: { id: this.authorId } });
    } else {
      this.router.navigate(['/managers/denunciante-perfil']);
    }
  }
}
