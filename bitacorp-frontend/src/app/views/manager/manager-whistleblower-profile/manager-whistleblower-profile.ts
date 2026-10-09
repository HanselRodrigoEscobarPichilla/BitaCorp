import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  imports: [CommonModule],
  selector: 'app-manager-whistleblower-profile',
  styleUrl: './manager-whistleblower-profile.scss',
  templateUrl: './manager-whistleblower-profile.html',
})
export class ManagerWhistleblowerProfile implements OnInit {

  userData = {
    nombre: '',
    correo: '',
    telefono: '',
    dpi: '',
    genero: '',
    departamento: ''
  };

  error: string | null = null;
  loading = false;

  constructor(private router: Router, private route: ActivatedRoute, private users: UsersService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!id || isNaN(id)) return;
    this.loading = true;
    this.users.whistleblowerForAgent(id).subscribe({
      next: (res) => {
        this.loading = false;
        const u = res.data;
        this.userData.nombre = `${u.first_name || ''} ${u.last_name || ''}`.trim();
        this.userData.correo = u.email || '';
        this.userData.telefono = u.phone || '';
        this.userData.dpi = u.dpi || '';
        this.userData.genero = u.gender || '';
        this.userData.departamento = u.department || '';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al cargar el denunciante';
      }
    });
  }

  salir(): void {
    this.router.navigate(['/managers']);
  }
}
