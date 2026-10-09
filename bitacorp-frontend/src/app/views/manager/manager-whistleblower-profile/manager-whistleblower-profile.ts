import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule],
  selector: 'app-manager-whistleblower-profile',
  styleUrl: './manager-whistleblower-profile.scss',
  templateUrl: './manager-whistleblower-profile.html',
})
export class ManagerWhistleblowerProfile {

  userData = {
    nombre: 'Nombre Completo Apellido Completo',
    correo: 'CorreoEjemplo@gmail.com',
    telefono: '+502 3534 4565',
    dpi: '454390438590348',
    genero: 'Masculino',
    departamento: 'Jutiapa'
  };

  constructor(private router: Router) {}

  salir(): void {
    this.router.navigate(['/managers']);
  }
}
