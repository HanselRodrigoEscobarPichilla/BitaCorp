import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  selector: 'app-manager-binnacles',
  styleUrl: './manager-binnacles.scss',
  templateUrl: './manager-binnacles.html',
})
export class ManagerBinnacles {

  binnacleData = {
    titulo: 'Titulo...',
    autor: 'Nombre Apellido autor',
    fecha: 'Fecha creacion',
    descripcion: 'Descripción...',
    efectos: 'Efectos...',
    lugar: 'Lugar...',
    fechaSucedido: 'Fecha de lo sucedido...'
  };

  constructor(private router: Router) {}

  verPerfilAutor(): void {
    this.router.navigate(['/managers/denunciante-perfil']);
  }
}
