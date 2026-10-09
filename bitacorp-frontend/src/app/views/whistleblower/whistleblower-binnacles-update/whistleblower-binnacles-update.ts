import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BinnacleService } from '../../../services/binnacle.service';
import { BinnacleResponse } from '../../../models/binnacle.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-whistleblower-binnacles-update',
  styleUrl: './whistleblower-binnacles-update.scss',
  templateUrl: './whistleblower-binnacles-update.html',
})
export class WhistleblowerBinnaclesUpdate implements OnInit {
  id!: number;
  form = {
    titulo: '',
    descripcion: '',
    efectos: '',
    lugar: '',
    fechaSucedido: '',
    tipoAgresor: '',
    descripcionAgresor: ''
  };
  existingFiles: Array<{ id_evidence?: number; file_path: string }> = [];
  newFiles: File[] = [];
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
        this.form.titulo = b.title || '';
        this.form.descripcion = b.descriptions || '';
        this.form.efectos = b.effects || '';
        this.form.lugar = b.place || '';
        this.form.fechaSucedido = b.date_event || '';
        if (b.aggressors && b.aggressors.length > 0) {
          this.form.tipoAgresor = b.aggressors[0].aggressors_type || '';
          this.form.descripcionAgresor = b.aggressors[0].description_aggressors || '';
        }
        this.existingFiles = b.evidences || [];
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.newFiles = Array.from(input.files);
  }

  actualizar(): void {
    this.error = null;
    if (!this.form.titulo.trim() || !this.form.descripcion.trim()) {
      this.error = 'El título y la descripción son obligatorios.';
      return;
    }
    if (this.loading) return;
    this.loading = true;
    const payload: any = {
      title: this.form.titulo,
      descriptions: this.form.descripcion,
      effects: this.form.efectos,
      place: this.form.lugar,
      date_event: this.form.fechaSucedido,
      aggressors: this.form.tipoAgresor
        ? [{ aggressors_type: this.form.tipoAgresor, description_aggressors: this.form.descripcionAgresor }]
        : []
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(payload));
    this.newFiles.forEach((f) => fd.append('files', f));

    this.binnacle.update(this.id, fd).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/whistleblowers']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al actualizar';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/whistleblowers']);
  }
}
