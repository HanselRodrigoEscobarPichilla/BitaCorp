import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [NgIf],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  showMenu: boolean = false;

  constructor(private router: Router, private auth: AuthService) {}

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  irAlPerfil(): void {
    this.showMenu = false;
    if (this.router.url.startsWith('/administrators')) {
      this.router.navigate(['/administrators/perfil']);
    } else if (this.router.url.startsWith('/managers')) {
      this.router.navigate(['/managers/perfil']);
    } else {
      this.router.navigate(['/whistleblowers/perfil']);
    }
  }

  cerrarSesion(): void {
    this.showMenu = false;
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
    