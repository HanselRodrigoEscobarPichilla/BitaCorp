import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  credentials = {
    correo: '',
    password: ''
  };
  error: string | null = null;
  loading = false;

  constructor(private router: Router, private auth: AuthService) {}

  onLogin(): void {
    this.error = null;
    this.loading = true;
    const payload = {
      email: this.credentials.correo.trim(),
      password: this.credentials.password
    };
    this.auth.login(payload).subscribe({
      next: (res) => {
        this.loading = false;
        const role = (res.user.role || '').toUpperCase();
        if (role === 'ENCARGADO') {
          this.router.navigate(['/managers']);
        } else if (role === 'ADMINISTRADOR') {
          this.router.navigate(['/administrators']);
        } else {
          this.router.navigate(['/whistleblowers']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}
