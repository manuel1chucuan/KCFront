import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CrearSucursal, Sucursal } from '../models/modelos';
import { UsuarioService } from '../services/web-services-empleados.service';
import { SucursalesService } from '../services/web-services-sucursales.service';
import { MessageService, ConfirmationService } from 'primeng/api'; 
import { PrimeNGConfig } from 'primeng/api'; 
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages'; // 🔥 IMPORTANTE
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
    this.primengConfig.ripple = true;
    this.obtenerSucursales(); // Cargar usuarios al iniciar el componente
  }

  crearSucursal(): void {

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

    this.sucursalesService.crearSucursal(this.nuevaSucursal).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Sucursal creada exitosamente.', life: 10000});
        this.limpiarFormulario();
        this.obtenerSucursales(); // Refrescar la lista después de crear un usuario
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear sucursal', life: 10000});
      }
    });
  }

  obtenerSucursales(): void {
    this.sucursalesService.obtenerSucursales().subscribe({
      next: (response: any) => { // Se define como 'any' porque la API devuelve un objeto con 'data'
        console.log('Respuesta de la API:', response); // Verifica la estructura real
  
        if (response && response.data && Array.isArray(response.data)) {
          this.sucursales = response.data; // Extrae solo la lista de usuarios
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

  sucursalSeleccionada: Sucursal | null = null; 
  pestanaActiva: string = 'gestionSucursales';

  seleccionarSucursal(sucursal: Sucursal): void {
    this.sucursalSeleccionada = sucursal;
    this.pestanaActiva = 'gestionSucursales';
  }

  // Método para guardar los cambios realizados
  guardarCambios(): void {
    if (!this.sucursalSeleccionada?.Nombre) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre de la sucursal es obligatorio.', life: 10000});
      return;
    }
    if (!this.sucursalSeleccionada?.CodigoPostal) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El cp de la sucursal es obligatorio.', life: 10000});
      return;
    }

    this.sucursalesService.modificarSucursal(this.sucursalSeleccionada).subscribe({
      next: () => {
        this.obtenerSucursales();
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Sucursal actualizada.', life: 10000});
      },
      error: (err) => {
        this.obtenerSucursales();
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al actualizar Sucursal, por favor intenta con datos diferentes', life: 10000});
      }
    });

    console.log('Sucursal actualizada:', this.sucursalSeleccionada);
    // Aquí puedes agregar la lógica para enviar estos cambios al backend y actualizar la base de datos
  }

  eliminarSucursal(): void {
    if (!this.sucursalSeleccionada?.ID) {
      return;
    }

    this.sucursalesService.eliminarSucursal(this.sucursalSeleccionada.ID)
      .subscribe({
        next: () => {
          this.obtenerSucursales();
          this.sucursalSeleccionada = null;

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

  confirmarEliminarSucursal(): void {
    if (!this.sucursalSeleccionada?.ID) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona una sucursal'
      });
      return;
    }

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

