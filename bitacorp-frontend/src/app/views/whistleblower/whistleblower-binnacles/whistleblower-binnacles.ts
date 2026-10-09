import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BinnacleService } from '../../../services/binnacle.service';
import { TokenService } from '../../../services/token.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-whistleblower-binnacles',
  styleUrl: './whistleblower-binnacles.scss',
  templateUrl: './whistleblower-binnacles.html',
})
export class WhistleblowerBinnacles {
  form = {
    titulo: '',
    descripcion: '',
    efectos: '',
    lugar: '',
    fechaSucedido: '',
    tipoAgresor: '',
    descripcionAgresor: ''
  };

  files: File[] = [];
  error: string | null = null;
  loading = false;

  constructor(private router: Router, private binnacle: BinnacleService, private token: TokenService) {}

  cancelar(): void {
    this.router.navigate(['/whistleblowers']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
    }
  }

  guardar(): void {
    const user = this.token.getUser();
    if (!user) return;
    this.error = null;
    this.loading = true;

    const payload = {
      descriptions: this.form.descripcion || this.form.titulo,
      effects: this.form.efectos,
      place: this.form.lugar,
      date_event: this.form.fechaSucedido,
      users_id: user.id,
      aggressors: this.form.tipoAgresor
        ? [
            {
              aggressors_type: this.form.tipoAgresor,
              description_aggressors: this.form.descripcionAgresor
            }
          ]
        : [],
      evidences: []
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(payload));
    this.files.forEach((f) => fd.append('files', f));

    this.binnacle.create(fd).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/whistleblowers']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al guardar bitácora';
      }
    });
  }
}
