import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  userData = {
    genero: '',
    departamento: '',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    dpi: '',
    telefono: ''
  };

  generosList: string[] = ['Femenino', 'Masculino', 'Otro'];

  departamentosList: string[] = [
    'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula',
    'El Progreso', 'Escuintla', 'Guatemala', 'Huehuetenango',
    'Izabal', 'Jalapa', 'Jutiapa', 'Petén', 'Quetzaltenango',
    'Quiché', 'Retalhuleu', 'Sacatepéquez', 'San Marcos',
    'Santa Rosa', 'Sololá', 'Suchitepéquez', 'Totonicapán', 'Zacapa'
  ];

  error: string | null = null;
  loading = false;

  constructor(private router: Router, private auth: AuthService) {}

  onRegister(): void {
    this.error = null;
    this.loading = true;

    const payload = {
      gender: this.userData.genero,
      department: this.userData.departamento,
      first_name: this.userData.nombre.trim(),
      last_name: this.userData.apellido.trim(),
      email: this.userData.correo.trim(),
      password_user: this.userData.password,
      dpi: this.userData.dpi.trim(),
      phone: this.userData.telefono.trim()
    };

    this.auth.registerWhistleblower(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al registrar';
      }
    });
  }
}
