import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // necesario para operativas básicas en HTML (ngFor, ngIf, etc.)
import { FormsModule } from '@angular/forms'; // necesario para habilitar ngModel en el HTML
import { CrearSucursal, Sucursal } from '../models/modelos';
import { UsuarioService } from '../services/web-services-empleados.service';
import { SucursalesService } from '../services/web-services-sucursales.service';
// MessageService imprime notificaciones
// CLEANUP o TODO: ConfirmationService no se usa. Usar o quitar 
import { MessageService, ConfirmationService } from 'primeng/api'; 
import { PrimeNGConfig } from 'primeng/api'; // para habilitar efecto ripple
import { DialogModule } from 'primeng/dialog'; // CLEANUP o TODO: no se usa. Usar o quitar
import { ButtonModule } from 'primeng/button'; // CLEANUP o TODO: no se usa. Usar o quitar
import { ToastModule } from 'primeng/toast'; // importa el tag <p-toast> en el componente
import { MessagesModule } from 'primeng/messages'; // 🔥 IMPORTANTE // CLEANUP o TODO: no se usa. Usar o quitar
// importa el tag <p-confirmDialog> en el componente
// CLEANUP o TODO: no se usa. Usar o quitar 
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule   // 🔥 ESTE ES EL IMPORTANTE
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss'
})
export class SucursalesComponent {


  nuevaSucursal: CrearSucursal = {
    nombre: '',
    codigoPostal: 0,
    estado: '',
    municipio: '',
    colonia: '',
    calle: '',
    numeroInt: 0,
    numeroExt: 0
  };

  sucursales: Sucursal[] = []; // Lista de usuarios

  constructor(private usuarioService: UsuarioService, 
    private sucursalesService: SucursalesService, 
    private primengConfig: PrimeNGConfig , 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,) {}

  ngOnInit() {
    // habilita un efecto animado en componentes primeng
    // REFACTOR: esta línea debería existir una sola vez en AppComponent, con eso aplica en toda la app
    this.primengConfig.ripple = true; 
    this.obtenerSucursales(); // Cargar usuarios al iniciar el componente
  }

  // al hacer click en Agregar Sucursal
  crearSucursal(): void {

    // validaciones del formulario
    if (!this.nuevaSucursal.nombre) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre de la sucursal es obligatorio.', life: 10000});
      return;
    }
    if (!this.nuevaSucursal.calle) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'La calle de la sucursal es obligatoria.', life: 10000});
      return;
    }
    if (this.nuevaSucursal.numeroExt === 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Se debe asignar un numero de exterior.', life: 10000});
      return;
    }
    if (!this.nuevaSucursal.colonia) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'La colonia de la sucursal es obligatoria.', life: 10000});
      return;
    }
    if (this.nuevaSucursal.codigoPostal === 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Se debe asignar un codigo postal.', life: 10000});
      return;
    }
    if (!this.nuevaSucursal.municipio) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El municipio de la sucursal es obligatorio.', life: 10000});
      return;
    }
    if (!this.nuevaSucursal.estado) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El estado de la sucursal es obligatorio.', life: 10000});
      return;
    }

    // petición a la API para crear una sucursal
    this.sucursalesService.crearSucursal(this.nuevaSucursal).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Sucursal creada exitosamente.', life: 10000});
        this.limpiarFormulario();
        this.obtenerSucursales(); // Refrescar la lista después de crear una nueva sucursal (TODO: overfetching?)
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear sucursal', life: 10000});
      }
    });
  }

  // obtiene las sucursales a través de SucursalesService
  obtenerSucursales(): void {
    this.sucursalesService.obtenerSucursales().subscribe({
      next: (response: any) => { // Se define como 'any' porque la API devuelve un objeto con 'data'
        console.log('Respuesta de la API:', response); // Verifica la estructura real
  
        if (response && response.data && Array.isArray(response.data)) {
          this.sucursales = response.data; // Extrae solo la lista de sucursales
        } else {
          console.error('La API no devolvió un array dentro de "data".', response);
          this.sucursales = []; // Evita errores asignando un array vacío
        }
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error obtener sucursales', life: 10000});
        console.error('Error obteniendo sucursales:', err);
      }
    });
  }

  // REFACTOR: variables declaradas en medio de la clase
  sucursalSeleccionada: Sucursal | null = null; 
  pestanaActiva: string = 'gestionSucursales';

  // al hacer click en cualquier sucursal,
  // recibe la sucursal seleccionada
  seleccionarSucursal(sucursal: Sucursal): void {
    this.sucursalSeleccionada = sucursal;
    // "navega" a la pestaña Gestión de Sucursales en el lado izquiero del componente
    this.pestanaActiva = 'gestionSucursales';
  }

  // al hacer click en Guardar Cambios en la pestaña Gestión de Sucursales
  // Método para guardar los cambios realizados
  guardarCambios(): void {
    // validaciones del formulario
    if (!this.sucursalSeleccionada?.Nombre) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre de la sucursal es obligatorio.', life: 10000});
      return;
    }
    if (!this.sucursalSeleccionada?.CodigoPostal) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El cp de la sucursal es obligatorio.', life: 10000});
      return;
    }

    // TODO: no hay alert de confirmación. Inconsistente con otras vistas

    // petición a la API para modificar una sucursal
    this.sucursalesService.modificarSucursal(this.sucursalSeleccionada).subscribe({
      next: () => {
        this.obtenerSucursales(); 
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Sucursal actualizada.', life: 10000});
      },
      error: (err) => {
        this.obtenerSucursales(); // CLEANUP: innecesario. Al haber error, no cambia el estado
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al actualizar Sucursal, por favor intenta con datos diferentes', life: 10000});
      }
    });

    console.log('Sucursal actualizada:', this.sucursalSeleccionada);
    // CLEANUP: eliminar este comentario. Ya se agregó dicha lógica
    // Aquí puedes agregar la lógica para enviar estos cambios al backend y actualizar la base de datos
  }

  // al hacer click en Eliminar en el alert de confirmación para eliminar una sucursal
  eliminarSucursal(): void {
    // validación para prevenir errores de sistema (mal estado)
    if (!this.sucursalSeleccionada?.ID) {
      return;
    }

    // petición a la API para eliminar una sucursal
    this.sucursalesService.eliminarSucursal(this.sucursalSeleccionada.ID)
      .subscribe({
        next: () => {
          // obtiene nuevamente las sucursales para solo renderizar las no eliminadas
          this.obtenerSucursales();
          this.sucursalSeleccionada = null; // el contenido en pestaña Gestión de Sucursales desaparece

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Sucursal eliminada correctamente',
            life: 5000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la sucursal',
            life: 5000
          });
        }
      });
  }

  // al hacer click en Eliminar Sucursal en la pestaña Gestión de Sucursales
  confirmarEliminarSucursal(): void {
    // validación para prevenir errores de sistema (mal estado)
    if (!this.sucursalSeleccionada?.ID) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona una sucursal'
      });
      return;
    }

    // renderiza el alert de confirmación para eliminar una sucursal
    Swal.fire({
      title: 'Confirmar eliminación',
      text: '¿Seguro que deseas eliminar la sucursal?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',

      reverseButtons: true,
      focusCancel: true,

      backdrop: true,

      scrollbarPadding: false, // 🔥 CLAVE
      heightAuto: false,        // 🔥 CLAVE

      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarSucursal();
      }
    });
  }

  // limpia el formulario Agregar Sucursal
  limpiarFormulario(): void {
    this.nuevaSucursal = {
      nombre: '',
      codigoPostal: 0,
      estado: '',
      municipio: '',
      colonia: '',
      calle: '',
      numeroInt: 0,
      numeroExt: 0
    };
  }
}

