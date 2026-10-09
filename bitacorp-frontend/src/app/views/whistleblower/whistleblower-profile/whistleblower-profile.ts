import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { TokenService } from '../../../services/token.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-whistleblower-profile',
  styleUrl: './whistleblower-profile.scss',
  templateUrl: './whistleblower-profile.html',
})
export class WhistleblowerProfile implements OnInit {

  userData = {
    nombre: '',
    correo: '',
    password: '************',
    telefono: '',
    dpi: '',
    genero: '',
    departamento: ''
  };

  generosList: string[] = ['Femenino', 'Masculino', 'Otro'];

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
    genero: false,
    departamento: false
  };

  error: string | null = null;
  loading = false;

  constructor(private router: Router, private users: UsersService, private token: TokenService) {}

  ngOnInit(): void {
    const user = this.token.getUser();
    if (!user) return;
    this.loading = true;
    this.users.getUserProfile(user.id).subscribe({
      next: (res) => {
        this.loading = false;
        const u = res.data;
        this.userData.nombre = `${u.first_name || ''} ${u.last_name || ''}`.trim();
        this.userData.correo = u.email || '';
        this.userData.telefono = u.phone_number || '';
        this.userData.dpi = u.dpi || '';
        this.userData.genero = u.gender || '';
        this.userData.departamento = u.department || '';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar el perfil';
      }
    });
  }

  toggleEdit(field: 'nombre' | 'telefono' | 'genero' | 'departamento'): void {
    this.isEditing[field] = !this.isEditing[field];
  }

  actualizarPerfil(): void {
    const user = this.token.getUser();
    if (!user) return;
    const parts = this.userData.nombre.trim().split(' ');
    const first = parts.shift() || '';
    const last = parts.join(' ');
    this.users.updateProfile(user.id, {
      first_name: first,
      last_name: last,
      email: this.userData.correo,
      phone: this.userData.telefono,
      dpi: this.userData.dpi,
      gender: this.userData.genero,
      department: this.userData.departamento
    } as any).subscribe({
      next: () => {
        this.isEditing.nombre = false;
        this.isEditing.telefono = false;
        this.isEditing.genero = false;
        this.isEditing.departamento = false;
      },
      error: (err) => (this.error = err?.error?.message || 'Error al actualizar')
    });
  }

  eliminarCuenta(): void {
    const user = this.token.getUser();
    if (!user) return;
    if (!confirm('¿Eliminar tu cuenta?')) return;
    this.users.deleteUser(user.id).subscribe({
      next: () => {
        this.token.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => (this.error = err?.error?.message || 'Error al eliminar')
    });
  }

  salir(): void {
    this.router.navigate(['/whistleblowers']);
  }
}
