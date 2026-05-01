import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from '../login/auth-service.service';
import { Sucursal } from '../models/modelos';
import { SucursalesService } from '../services/web-services-sucursales.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  correo: string = '';
  contrasena: string = '';
  mostrarFormularioAdministrador: boolean = false;
  mostrarAsignacionSucursal: boolean = false;
  requiereAsignacionSucursal: boolean = false;
  sucursalAsignada: Sucursal | null = null;
  sucursalesDisponibles: Sucursal[] = [];
  sucursalSeleccionadaId: string = '';
  cargandoSucursales: boolean = false;
  asignandoSucursal: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private sucursalesService: SucursalesService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.actualizarEstadoSucursal();

    if (!this.requiereAsignacionSucursal || !this.authService.isAuthenticated()) {
      return;
    }

    if (!(this.authService.getPermisosUsuario()?.admin ?? false)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Se requiere un administrador para asignar la sucursal.',
      });
      this.authService.logout();
      return;
    }

    this.mostrarFormularioAdministrador = true;
    this.prepararAsignacionSucursal();
  }

  ingresarModoCajero(): void {
    if (this.requiereAsignacionSucursal) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sucursal requerida',
        detail: 'Primero asigna una sucursal para habilitar el Modo Cajero.',
      });
      return;
    }

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

    if (this.requiereAsignacionSucursal && this.authService.isAuthenticated() && (this.authService.getPermisosUsuario()?.admin ?? false)) {
      this.prepararAsignacionSucursal();
    }
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
        if (this.requiereAsignacionSucursal) {
          if (!(this.authService.getPermisosUsuario()?.admin ?? false)) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Solo un administrador puede asignar la sucursal.',
            });
            this.authService.logout();
            return;
          }

          this.prepararAsignacionSucursal();
          return;
        }

        localStorage.setItem('componenteActual', 'caja');
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Correo o contraseña incorrectos'});
        console.log(err);
      }
    });
  }

  asignarSucursal(): void {
    if (!this.sucursalSeleccionadaId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Selecciona una sucursal.',
      });
      return;
    }

    this.asignandoSucursal = true;

    this.sucursalesService.asignarSucursal(this.sucursalSeleccionadaId).subscribe({
      next: (response) => {
        localStorage.setItem('componenteActual', 'caja');
        this.actualizarEstadoSucursal();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Sucursal ${response.data.sucursal.nombre} asignada correctamente.`,
        });
        this.resetFormularioAdministrador();
        this.authService.logout();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.obtenerMensajeError(err, 'No fue posible asignar la sucursal.'),
        });
        console.log(err);
      },
      complete: () => {
        this.asignandoSucursal = false;
      }
    });
  }

  cancelarModoAdministrador(): void {
    const debeCerrarSesion = this.requiereAsignacionSucursal && this.authService.isAuthenticated();
    this.resetFormularioAdministrador();

    if (debeCerrarSesion) {
      this.authService.logout();
    }
  }

  private prepararAsignacionSucursal(): void {
    if (this.cargandoSucursales) {
      return;
    }

    this.mostrarAsignacionSucursal = true;

    if (this.sucursalesDisponibles.length > 0) {
      return;
    }

    this.cargandoSucursales = true;

    this.sucursalesService.obtenerSucursales().subscribe({
      next: (response) => {
        this.sucursalesDisponibles = response.data ?? [];

        if (this.sucursalesDisponibles.length === 1) {
          this.sucursalSeleccionadaId = this.sucursalesDisponibles[0].id;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.obtenerMensajeError(err, 'No fue posible cargar las sucursales.'),
        });
        console.log(err);
      },
      complete: () => {
        this.cargandoSucursales = false;
      }
    });
  }

  private actualizarEstadoSucursal(): void {
    this.requiereAsignacionSucursal = !this.sucursalesService.tieneSucursalAsignadaValida();
    this.sucursalAsignada = this.sucursalesService.obtenerSucursalAsignada();
  }

  private resetFormularioAdministrador(): void {
    this.correo = '';
    this.contrasena = '';
    this.mostrarFormularioAdministrador = false;
    this.mostrarAsignacionSucursal = false;
    this.sucursalesDisponibles = [];
    this.sucursalSeleccionadaId = '';
    this.cargandoSucursales = false;
    this.asignandoSucursal = false;
  }

  private obtenerMensajeError(error: any, mensajePorDefecto: string): string {
    return error?.error?.error || error?.message || mensajePorDefecto;
  }
}
