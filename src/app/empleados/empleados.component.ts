import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CrearUsuario, Usuario } from '../objetos/usuario';
import { UsuarioService } from '../services/web-services-empleados.service';
import { MessageService } from 'primeng/api'; 
import { PrimeNGConfig } from 'primeng/api'; 
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages'; // 🔥 IMPORTANTE

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule, DialogModule, MessagesModule], // 🔥 Asegurar que MessagesModule está importado
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
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

  usuarios: Usuario[] = []; // Lista de usuarios

  constructor(private usuarioService: UsuarioService, private primengConfig: PrimeNGConfig , private messageService: MessageService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.obtenerUsuarios(); // Cargar usuarios al iniciar el componente
  }

  crearUsuario(): void {
    if (!this.nuevoUsuario.nombreDeUsuario) {
      console.log('El nombre de usuario es obligatorio.');
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre de usuario es obligatorio.', life: 10000});
      return;
    }
    if (!this.nuevoUsuario.correo) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El correo es obligatorio.', life: 10000});
      return;
    }
    if (!this.nuevoUsuario.contrasena) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'La contraseña es obligatoria.', life: 10000});
      return;
    }

    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (usuarioCreado) => {
        console.log('Usuario creado:', usuarioCreado);
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Usuario creado exitosamente.', life: 10000});
        this.limpiarFormulario();
        this.obtenerUsuarios(); // Refrescar la lista después de crear un usuario
      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear el usuario. Intente con otro nombre u otro correo', life: 10000});
      }
    });
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (response: any) => { // Se define como 'any' porque la API devuelve un objeto con 'data'
        console.log('Respuesta de la API:', response); // Verifica la estructura real
  
        if (response && response.data && Array.isArray(response.data)) {
          this.usuarios = response.data; // Extrae solo la lista de usuarios
        } else {
          console.error('La API no devolvió un array dentro de "data".', response);
          this.usuarios = []; // Evita errores asignando un array vacío
        }
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error obtener usuarios', life: 10000});
        console.error('Error obteniendo usuarios:', err);
      }
    });
  }

  usuarioSeleccionado: Usuario | null = null; // Para almacenar el usuario seleccionado

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario; // Asignamos el usuario al ser clickeado
  }

  // Método para guardar los cambios realizados
  guardarCambios(): void {
    if (!this.usuarioSeleccionado?.NombreDeUsuario) {
      console.log('El nombre de usuario es obligatorio.');
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre de usuario es obligatorio.', life: 10000});
      return;
    }
    if (!this.usuarioSeleccionado?.Correo) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El correo es obligatorio.', life: 10000});
      return;
    }

    this.usuarioService.modificarUsuario(this.usuarioSeleccionado).subscribe({
      next: () => {
        console.log('Usuario modificado correctamente');
        this.obtenerUsuarios();
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Usuario modificado exitosamente.', life: 10000});
      },
      error: (err) => {
        console.error('Error al modificar usuario:', err);
        this.obtenerUsuarios();
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear usuario, por favor intenta con datos diferentes', life: 10000});
      }
    });

    console.log('Usuario actualizado:', this.usuarioSeleccionado);
    // Aquí puedes agregar la lógica para enviar estos cambios al backend y actualizar la base de datos
  }

  eliminarUsuario(): void {
    if (!this.usuarioSeleccionado?.ID) {
      console.log('Seleciona un usuario.');
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Seleciona un usuario.', life: 10000});
      return;
    }
    this.usuarioService.eliminarUsuario(this.usuarioSeleccionado.ID).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        this.obtenerUsuarios();
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente.', life: 10000});
        // Puedes realizar alguna acción adicional aquí (como mostrar un mensaje de éxito)
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.obtenerUsuarios();
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar usuario', life: 10000});
        // Manejo de errores, como mostrar un mensaje de error
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
