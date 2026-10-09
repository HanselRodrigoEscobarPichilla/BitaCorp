import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-administrator-profile',
  styleUrl: './administrator-profile.scss',
  templateUrl: './administrator-profile.html',
})
export class AdministratorProfile {

  userData = {
    nombre: 'Nombre Completo Apellido Completo',
    correo: 'CorreoEjemplo@gmail.com',
    password: '************',
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
    departamento: false
  };

  constructor(private router: Router) {}

  toggleEdit(field: 'nombre' | 'departamento'): void {
    this.isEditing[field] = !this.isEditing[field];
  }

  actualizarPerfil(): void {
    this.router.navigate(['/administrators']);
  }

  eliminarCuenta(): void {
    this.router.navigate(['/administrators']);
  }

  salir(): void {
    this.router.navigate(['/administrators']);
  }
}
