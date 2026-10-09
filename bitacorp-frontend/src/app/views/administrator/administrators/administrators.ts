import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { UserResponse } from '../../../models/user.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-administrators',
  styleUrl: './administrators.scss',
  templateUrl: './administrators.html',
})
export class Administrators implements OnInit {

  activeTab: 'denunciantes' | 'agentes' | 'administradores' | 'registrar-agentes' | 'registrar-administradores' = 'denunciantes';
  searchQuery: string = '';
  loading = false;
  error: string | null = null;

  departamentosList: string[] = [
    'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula',
    'El Progreso', 'Escuintla', 'Guatemala', 'Huehuetenango',
    'Izabal', 'Jalapa', 'Jutiapa', 'Petén', 'Quetzaltenango',
    'Quiché', 'Retalhuleu', 'Sacatepéquez', 'San Marcos',
    'Santa Rosa', 'Sololá', 'Suchitepéquez', 'Totonicapán', 'Zacapa'
  ];

  private _denunciantes: Array<{ id: string; nombre: string; correo: string; telefono: string; dpi: string; genero: string; departamento: string }> = [];
  private _agentes: Array<{ id: string; nombre: string; correo: string; telefono: string; dpi: string; estado: string; departamento: string }> = [];
  private _administradores: Array<{ id: string; nombre: string; correo: string; dpi: string; estado: string; departamento: string }> = [];

  get denunciantes() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this._denunciantes;
    return this._denunciantes.filter(u => u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q));
  }

  get agentes() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this._agentes;
    return this._agentes.filter(u => u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q));
  }

  get administradores() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this._administradores;
    return this._administradores.filter(u => u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q));
  }

  nuevoAgente = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    dpi: '',
    departamento: 'Jutiapa'
  };

  nuevoAdmin = {
    nombre: '',
    apellido: '',
    correo: '',
    dpi: '',
    departamento: 'Jutiapa'
  };

  constructor(private users: UsersService) {}

  ngOnInit(): void {
    this.loadRole(this.activeTab);
  }

  setTab(tab: 'denunciantes' | 'agentes' | 'administradores' | 'registrar-agentes' | 'registrar-administradores'): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.error = null;
    this.loadRole(tab);
  }

  private loadRole(tab: string): void {
    if (tab === 'denunciantes') this.loadWhistleblowers();
    else if (tab === 'agentes') this.loadManagers();
    else if (tab === 'administradores') this.loadAdmins();
  }

  private fullName(u: UserResponse): string {
    const name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
    return name || u.email;
  }

  private loadWhistleblowers(): void {
    this.loading = true;
    this.users.getUsersByRole('whistleblower').subscribe({
      next: (res) => {
        this.loading = false;
        this._denunciantes = (res.data || []).map(u => ({
          id: String(u.id_users),
          nombre: this.fullName(u),
          correo: u.email,
          telefono: u.phone_number || '',
          dpi: u.dpi || '',
          genero: u.gender || '',
          departamento: u.department || ''
        }));
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar denunciantes';
      }
    });
  }

  private loadManagers(): void {
    this.loading = true;
    this.users.getUsersByRole('manager').subscribe({
      next: (res) => {
        this.loading = false;
        this._agentes = (res.data || []).map(u => ({
          id: String(u.id_users),
          nombre: this.fullName(u),
          correo: u.email,
          telefono: u.phone_number || '',
          dpi: u.dpi || '',
          estado: u.State || 'Activo',
          departamento: u.department || ''
        }));
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar agentes';
      }
    });
  }

  private loadAdmins(): void {
    this.loading = true;
    this.users.getUsersByRole('admin').subscribe({
      next: (res) => {
        this.loading = false;
        this._administradores = (res.data || []).map(u => ({
          id: String(u.id_users),
          nombre: this.fullName(u),
          correo: u.email,
          dpi: u.dpi || '',
          estado: u.State || 'Activo',
          departamento: u.department || ''
        }));
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar administradores';
      }
    });
  }

  eliminarDenunciante(id: string): void {
    if (!confirm('¿Eliminar usuario?')) return;
    this.users.deleteUser(Number(id)).subscribe({
      next: () => this.loadWhistleblowers(),
      error: (err) => (this.error = err?.error?.message || 'Error al eliminar')
    });
  }

  eliminarAgente(id: string): void {
    if (!confirm('¿Eliminar usuario?')) return;
    this.users.deleteUser(Number(id)).subscribe({
      next: () => this.loadManagers(),
      error: (err) => (this.error = err?.error?.message || 'Error al eliminar')
    });
  }

  eliminarAdministrador(id: string): void {
    if (!confirm('¿Eliminar usuario?')) return;
    this.users.deleteUser(Number(id)).subscribe({
      next: () => this.loadAdmins(),
      error: (err) => (this.error = err?.error?.message || 'Error al eliminar')
    });
  }

  crearAgente(): void {
    if (!this.nuevoAgente.nombre || !this.nuevoAgente.correo) {
      this.error = 'Nombre y correo son obligatorios.';
      return;
    }
    this.error = null;
    this.loading = true;
    this.users.registerManager({
      first_name: this.nuevoAgente.nombre.trim(),
      last_name: this.nuevoAgente.apellido.trim(),
      email: this.nuevoAgente.correo.trim(),
      passwords: this.nuevoAgente.dpi.trim() || 'BitaCorp123',
      phone_number: this.nuevoAgente.telefono.trim(),
      dpi: this.nuevoAgente.dpi.trim(),
      department: this.nuevoAgente.departamento
    }).subscribe({
      next: () => {
        this.loading = false;
        this.nuevoAgente = { nombre: '', apellido: '', correo: '', telefono: '', dpi: '', departamento: 'Jutiapa' };
        this._agentes = [];
        this.loadManagers();
        this.activeTab = 'agentes';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al registrar agente';
      }
    });
  }

  crearAdmin(): void {
    if (!this.nuevoAdmin.nombre || !this.nuevoAdmin.correo) {
      this.error = 'Nombre y correo son obligatorios.';
      return;
    }
    this.error = null;
    this.loading = true;
    this.users.registerAdmin({
      first_name: this.nuevoAdmin.nombre.trim(),
      last_name: this.nuevoAdmin.apellido.trim(),
      email: this.nuevoAdmin.correo.trim(),
      passwords: this.nuevoAdmin.dpi.trim() || 'BitaCorp123',
      dpi: this.nuevoAdmin.dpi.trim(),
      department: this.nuevoAdmin.departamento
    }).subscribe({
      next: () => {
        this.loading = false;
        this.nuevoAdmin = { nombre: '', apellido: '', correo: '', dpi: '', departamento: 'Jutiapa' };
        this._administradores = [];
        this.loadAdmins();
        this.activeTab = 'administradores';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al registrar administrador';
      }
    });
  }
}
