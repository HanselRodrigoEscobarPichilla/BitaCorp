import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BinnacleService } from '../../../services/binnacle.service';
import { BinnacleResponse } from '../../../models/binnacle.model';

@Component({
  imports: [CommonModule],
  selector: 'app-whistleblower-binnacles-check',
  styleUrl: './whistleblower-binnacles-check.scss',
  templateUrl: './whistleblower-binnacles-check.html',
})
export class WhistleblowerBinnaclesCheck implements OnInit {
  id!: number;
  data: any = {
    titulo: '',
    descripcion: '',
    efectos: '',
    lugar: '',
    fechaSucedido: '',
    estado: '',
    tipoAgresor: '',
    descripcionAgresor: '',
    evidences: [] as Array<{ file_path: string }>
  };
  loading = false;
  error: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private binnacle: BinnacleService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(this.id)) this.load();
  }

  load(): void {
    this.loading = true;
    this.binnacle.getById(this.id).subscribe({
      next: (res) => {
        this.loading = false;
        const b: BinnacleResponse = res.data;
        this.data.titulo = b.title || '';
        this.data.descripcion = b.descriptions || '';
        this.data.efectos = b.effects || '';
        this.data.lugar = b.place || '';
        this.data.fechaSucedido = b.date_event || '';
        this.data.estado = b.state || '';
        if (b.aggressors?.length) {
          this.data.tipoAgresor = b.aggressors[0].aggressors_type || '';
          this.data.descripcionAgresor = b.aggressors[0].description_aggressors || '';
        }
        this.data.evidences = b.evidences || [];
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar';
      }
    });
  }

  salir(): void {
    this.router.navigate(['/whistleblowers']);
  }
}
