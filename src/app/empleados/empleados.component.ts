import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // necesario para operativas básicas en HTML (ngFor, ngIf, etc.)
import { FormsModule } from '@angular/forms'; // necesario para habilitar ngModel en el HTML
import { CrearUsuario, Usuario } from '../models/modelos';
import { UsuarioService } from '../services/web-services-empleados.service';
import { MessageService } from 'primeng/api'; // imprime notificaciones
import { PrimeNGConfig } from 'primeng/api'; // para habilitar efecto ripple
import { DialogModule } from 'primeng/dialog'; // CLEANUP o TODO: no se usa. Usar o quitar
import { ButtonModule } from 'primeng/button'; // CLEANUP o TODO: no se usa. Usar o quitar
import { ToastModule } from 'primeng/toast'; // importa el tag <p-toast> en el componente
import { MessagesModule } from 'primeng/messages'; // 🔥 IMPORTANTE // CLEANUP o TODO: no se usa. Usar o quitar
import Swal from 'sweetalert2';

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
    // habilita un efecto animado en componentes primeng
    // REFACTOR: esta línea debería existir una sola vez en AppComponent, con eso aplica en toda la app
    this.primengConfig.ripple = true; 
    this.obtenerUsuarios(); // Cargar usuarios al iniciar el componente
  }

  // al hacer click en Agregar Usuario o hacer enter en cualquier input de Agregar Usuario
  crearUsuario(): void {
    // validaciones del formulario
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

    // petición a la API para crear un usuario
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

  // obtiene los usuarios a través de UsuariosService
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

  // REFACTOR: variables declaradas en medio de la clase
  usuarioSeleccionado: Usuario | null = null; 
  pestanaActiva: string = 'gestionUsuarios'; // 🔥 Cambié "pestañaActiva" a "pestanaActiva"

  // al hacer click en cualquier usuario,
  // recibe el usuario seleccionada
  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    // "navega" a la pestaña Gestión de Sucursales en el lado izquiero del componente
    this.pestanaActiva = 'gestionUsuarios'; // 🔥 También cambié aquí
  }

  // al hacer click en Guardar Cambios en la pestaña Gestión de Usuarios
  confirmarGuardarCambios(): void {
    // validaciones del formulario
    if (!this.usuarioSeleccionado?.NombreDeUsuario) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre de usuario es obligatorio.',
        life: 10000
      });
      return;
    }

    if (!this.usuarioSeleccionado?.Correo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El correo es obligatorio.',
        life: 10000
      });
      return;
    }

    // renderiza el alert de confirmación para modificar un usuario
    Swal.fire({
      title: 'Confirmar cambios',
      text: '¿Seguro que deseas guardar los cambios del usuario?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',

      reverseButtons: true,
      focusCancel: true,

      scrollbarPadding: false,
      heightAuto: false,

      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardarCambios(); // 🔥 mismo patrón que eliminar
      }
    });
  }


  // Método para guardar los cambios realizados
  guardarCambios(): void {
    // REFACTOR: innecesario. Esta validación ya está en confirmarGuardarCambios
    if (!this.usuarioSeleccionado?.Correo) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El correo es obligatorio.', life: 10000});
      return;
    }

    // petición a la API para modificar un usuario
    this.usuarioService.modificarUsuario(this.usuarioSeleccionado).subscribe({
      next: () => {
        this.obtenerUsuarios(); // para actualizar los usuarios con el usuario modificado

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Usuario modificado correctamente',
          timer: 1500,
          showConfirmButton: false,
          scrollbarPadding: false,
          heightAuto: false
        });
      },
      error: (err) => {
        console.error('Error al modificar usuario:', err);
        this.obtenerUsuarios(); // CLEANUP: innecesario. Al haber error, no cambia el estado

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el usuario',
          scrollbarPadding: false,
          heightAuto: false
        });
      }
    });
  }

  // al hacer click en Eliminar en el alert de confirmación para eliminar un usuario
  eliminarUsuario(): void {
    // validación para prevenir errores de sistema (mal estado)
    if (!this.usuarioSeleccionado?.ID) {
      return;
    }

    // petición a la API para eliminar un usuario
    this.usuarioService.eliminarUsuario(this.usuarioSeleccionado.ID)
      .subscribe({
        next: () => {
          // obtiene nuevamente los usuarios para solo renderizar los no eliminadas
          this.obtenerUsuarios();
          this.usuarioSeleccionado = null; // el contenido en pestaña Gestión de Usuarios desaparece

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Usuario eliminado correctamente',
            timer: 1500,
            showConfirmButton: false,
            scrollbarPadding: false,
            heightAuto: false
          });
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el usuario',
            scrollbarPadding: false,
            heightAuto: false
          });
        }
      });
  }

  // al hacer click en Eliminar Usuario en la pestaña Gestión de Usuario
  confirmarEliminarUsuario(): void {
    // validación para prevenir errores de sistema (mal estado)
    if (!this.usuarioSeleccionado?.ID) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona un usuario',
        life: 5000
      });
      return;
    }

    // renderiza el alert de confirmación para eliminar un usuario
    Swal.fire({
      title: 'Confirmar eliminación',
      text: `¿Seguro que deseas eliminar al usuario seleccionado?`,
      icon: 'warning',

      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',

      reverseButtons: true,
      focusCancel: true,

      scrollbarPadding: false,
      heightAuto: false,

      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUsuario(); // 🔥 aquí sí elimina
      }
    });
  }

  // limpia el formulario Agregar Usuario
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
