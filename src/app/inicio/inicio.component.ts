import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from '../login/auth-service.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
  correo: string = '';
  contrasena: string = '';
  mostrarFormularioAdministrador: boolean = false;

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

  ingresarModoAdministrador(): void {
    this.mostrarFormularioAdministrador = true;
  }

  onLoginAdministrador(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(this.correo)) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Ingresa un correo Valido'});
      return;
    }

    if (!this.contrasena) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Ingresa una contraseña'});
      return;
    }

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: () => {
        localStorage.setItem('componenteActual', 'caja');
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Correo o contraseña incorrectos'});
        console.log(err);
      }
    });
  }
}
