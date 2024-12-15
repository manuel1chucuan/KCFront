import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CrearUsuario } from '../objetos/usuario';
import { UsuarioService } from '../services/web-services-empleados.service';
import { MessageService } from 'primeng/api'; // Importar MessageService
import { MessagesModule } from 'primeng/messages'; // Asegúrate de importar este módulo también

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, MessagesModule], // Añadir MessagesModule aquí
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss'],
  providers: [MessageService] // Añadir MessageService como proveedor
})
export class EmpleadosComponent {
  nuevoUsuario: CrearUsuario = {
    nombreDeUsuario: '',
    correo: '',
    contrasena: '',
    admini: false,
    caja: false,
    servicio: false,
    inventario: false,
    activo: true
  };

  constructor(private usuarioService: UsuarioService, private messageService: MessageService) {}

  crearUsuario(): void {
    // Validación de campos
    if (!this.nuevoUsuario.nombreDeUsuario) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre de usuario es obligatorio.'});
      return;
    }
    if (!this.nuevoUsuario.correo) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El correo es obligatorio.'});
      return;
    }
    if (!this.nuevoUsuario.contrasena) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'La contraseña es obligatoria.'});
      return;
    }

    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (usuarioCreado) => {
        console.log('Usuario creado:', usuarioCreado);
        alert('Usuario creado exitosamente');
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
        alert('Error al crear el usuario');
      }
    });
  }

  limpiarFormulario(): void {
    this.nuevoUsuario = {
      nombreDeUsuario: '',
      correo: '',
      contrasena: '',
      admini: false,
      caja: false,
      servicio: false,
      inventario: false,
      activo: true
    };
  }
}
