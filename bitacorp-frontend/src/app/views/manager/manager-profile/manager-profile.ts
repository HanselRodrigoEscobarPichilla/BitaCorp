import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-manager-profile',
  styleUrl: './manager-profile.scss',
  templateUrl: './manager-profile.html',
})
export class ManagerProfile {

  userData = {
    nombre: 'Nombre Completo Apellido Completo',
    correo: 'CorreoEjemplo@gmail.com',
    password: '************',
    telefono: '+502 3534 4565',
    dpi: '454390438590348',
    departamento: 'Jutiapa'
  };

  departamentosList: string[] = [
    'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula', 
    'El Progreso', 'Escuintla', 'Guatemala', 'Huehuetenango', 
    'Izabal', 'Jalapa', 'Jutiapa', 'Petén', 'Quetzaltenango', 
    'Quiché', 'Retalhuleu', 'Sacatepéquez', 'San Marcos', 
    'Santa Rosa', 'Sololá', 'Suchitepéquez', 'Totonicapán', 'Zacapa'
  ];

  isEditing = {
    nombre: false,
    telefono: false,
    departamento: false
  };

  constructor(private router: Router) {}

  toggleEdit(field: 'nombre' | 'telefono' | 'departamento'): void {
    this.isEditing[field] = !this.isEditing[field];
  }

  actualizarPerfil(): void {
    this.router.navigate(['/managers']);
  }

  eliminarCuenta(): void {
    this.router.navigate(['/managers']);
  }

  salir(): void {
    this.router.navigate(['/managers']);
  }
}
