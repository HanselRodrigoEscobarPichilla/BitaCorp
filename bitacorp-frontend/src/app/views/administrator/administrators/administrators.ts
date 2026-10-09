import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-administrators',
  styleUrl: './administrators.scss',
  templateUrl: './administrators.html',
})
export class Administrators {

  activeTab: 'denunciantes' | 'agentes' | 'administradores' | 'registrar-agentes' | 'registrar-administradores' = 'denunciantes';
  searchQuery: string = '';

  departamentosList: string[] = [
    'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula', 
    'El Progreso', 'Escuintla', 'Guatemala', 'Huehuetenango', 
    'Izabal', 'Jalapa', 'Jutiapa', 'Petén', 'Quetzaltenango', 
    'Quiché', 'Retalhuleu', 'Sacatepéquez', 'San Marcos', 
    'Santa Rosa', 'Sololá', 'Suchitepéquez', 'Totonicapán', 'Zacapa'
  ];

  denunciantes = [
    { id: '1', nombre: 'Nombre Completo Apellido Completo', correo: 'CorreoEjemplo@gmail.com', telefono: '+502 3534 4565', dpi: '454390438590348', genero: 'Masculino', departamento: 'Jutiapa' },
    { id: '2', nombre: 'Nombre Completo Apellido Completo', correo: 'CorreoEjemplo@gmail.com', telefono: '+502 3534 4565', dpi: '454390438590348', genero: 'Masculino', departamento: 'Jutiapa' }
  ];

  agentes = [
    { id: '101', nombre: 'Nombre Completo Apellido Completo', correo: 'CorreoEjemplo@gmail.com', telefono: '+502 3534 4565', dpi: '454390438590348', estado: 'Activo', departamento: 'Jutiapa' },
    { id: '102', nombre: 'Nombre Completo Apellido Completo', correo: 'CorreoEjemplo@gmail.com', telefono: '+502 3534 4565', dpi: '454390438590348', estado: 'Activo', departamento: 'Jutiapa' }
  ];

  administradores = [
    { id: '201', nombre: 'Nombre Completo Apellido Completo', correo: 'CorreoEjemplo@gmail.com', dpi: '454390438590348', estado: 'Activo', departamento: 'Jutiapa' },
    { id: '202', nombre: 'Nombre Completo Apellido Completo', correo: 'CorreoEjemplo@gmail.com', dpi: '454390438590348', estado: 'Activo', departamento: 'Jutiapa' }
  ];

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

  setTab(tab: 'denunciantes' | 'agentes' | 'administradores' | 'registrar-agentes' | 'registrar-administradores'): void {
    this.activeTab = tab;
  }

  eliminarDenunciante(id: string): void {
    this.denunciantes = this.denunciantes.filter(u => u.id !== id);
  }

  eliminarAgente(id: string): void {
    this.agentes = this.agentes.filter(u => u.id !== id);
  }

  eliminarAdministrador(id: string): void {
    this.administradores = this.administradores.filter(u => u.id !== id);
  }

  crearAgente(): void {
    if (this.nuevoAgente.nombre && this.nuevoAgente.correo) {
      this.agentes.push({
        id: Date.now().toString(),
        nombre: `${this.nuevoAgente.nombre} ${this.nuevoAgente.apellido}`,
        correo: this.nuevoAgente.correo,
        telefono: this.nuevoAgente.telefono,
        dpi: this.nuevoAgente.dpi,
        estado: 'Activo',
        departamento: this.nuevoAgente.departamento
      });
      this.nuevoAgente = { nombre: '', apellido: '', correo: '', telefono: '', dpi: '', departamento: 'Jutiapa' };
      this.activeTab = 'agentes';
    }
  }

  crearAdmin(): void {
    if (this.nuevoAdmin.nombre && this.nuevoAdmin.correo) {
      this.administradores.push({
        id: Date.now().toString(),
        nombre: `${this.nuevoAdmin.nombre} ${this.nuevoAdmin.apellido}`,
        correo: this.nuevoAdmin.correo,
        dpi: this.nuevoAdmin.dpi,
        estado: 'Activo',
        departamento: this.nuevoAdmin.departamento
      });
      this.nuevoAdmin = { nombre: '', apellido: '', correo: '', dpi: '', departamento: 'Jutiapa' };
      this.activeTab = 'administradores';
    }
  }
}
