import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from '../login/auth-service.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ingresarModoCajero(): void {
    this.authService.loginCajero().subscribe({
      next: () => {
        localStorage.setItem('componenteActual', 'caja');
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible iniciar sesion en Modo Cajero.',
        });
        console.log(err);
      }
    });
  }
}
