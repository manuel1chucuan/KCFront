import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CrearServicio, Servicio, Sucursal, ServicioPorSucursal } from '../models/modelos';
import { ServiciosService } from '../services/web-services-servicios.service';
import { SucursalesService } from '../services/web-services-sucursales.service';
import { MessageService } from 'primeng/api'; 
import { PrimeNGConfig } from 'primeng/api'; 
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule, DialogModule, MessagesModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent {

    nuevoServicio: CrearServicio = {
      nombre: '',
      descripcion: ''
    };

    nuevoDetalleDelServicio: ServicioPorSucursal = {
      IdSucursal: '',
      Precio: 0,
      FechaCreacion: null,
      CreadoPor: null
    };
  
    servicios: Servicio[] = [];
    sucursales: Sucursal[] = [];
    sucursalesDisponibles: Sucursal[] = [];
  
    constructor(private serviciosService: ServiciosService,private sucursalesService: SucursalesService, 
      private primengConfig: PrimeNGConfig , private messageService: MessageService) {}
  
    ngOnInit() {
      this.primengConfig.ripple = true;
      this.obtenerSucursales();
    }
  
    crearServicio(): void {
      if (!this.nuevoServicio.nombre) {
        console.log('El nombre del servicio es obligatorio.');
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre del servicio es obligatorio.', life: 10000});
        return;
      }
  
      this.serviciosService.crearServicio(this.nuevoServicio).subscribe({
        next: (servicioCreado) => {
          console.log('Servicio creado:', servicioCreado);
          this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Servicio creado exitosamente.', life: 10000});
          this.limpiarFormulario();
          this.obtenerServicios();
        },
        error: (err) => {
          console.error('Error al crear el servicio:', err);
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear el servicio. Intente con otro nombre', life: 10000});
        }
      });
    }
  
    obtenerServicios(): void {
      this.serviciosService.obtenerServicios().subscribe({
        next: (response: any) => {
          console.log('Respuesta de la API:', response);
    
          if (response && response.data && Array.isArray(response.data)) {
            this.servicios = response.data;
            this.servicioSeleccionado = this.servicios.find(s => s.ID === this.servicioSeleccionado?.ID) ?? null;
          } else {
            console.error('La API no devolvió un array dentro de "data".', response);
            this.servicios = [];
          }
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error obtener al obtener servicios', life: 10000});
          console.error('Error obteniendo servicios:', err);
        }
      });
    }
  
    servicioSeleccionado: Servicio | null = null; 
    nombreServicioSeleccionado: string = "";
    descripcionServicioSeleccionado: string = "";
    pestanaActiva: string = 'agregarServicio';
    nuevoPrecio: number | null = null;
    sucursalSeleccionadaId: string | null = null;
  
    seleccionarServicio(servicio: Servicio): void {
      this.servicioSeleccionado = servicio;
      this.nombreServicioSeleccionado = this.servicioSeleccionado.Nombre;
      this.descripcionServicioSeleccionado = this.servicioSeleccionado.Descripcion;
      this.pestanaActiva = 'gestionServicios';
    }
  
    confirmarGuardarCambios(): void {
      if (!this.servicioSeleccionado) {
        return;
      }

      // Validación previa (antes de preguntar)
      if (!this.nombreServicioSeleccionado) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El nombre es obligatorio',
          life: 5000
        });
        return;
      }

      Swal.fire({
        title: 'Guardar cambios',
        text: '¿Deseas guardar los cambios realizados en el servicio?',
        icon: 'question',

        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',

        reverseButtons: true,
        focusConfirm: true,

        scrollbarPadding: false,
        heightAuto: false,

        customClass: {
          confirmButton: 'swal-confirm-btn',
          cancelButton: 'swal-cancel-btn'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarCambios(); // 🔥 aquí sí guarda
        }
      });
    }


    guardarCambios(): void {
      if (!this.servicioSeleccionado) {
        return;
      }

      this.servicioSeleccionado.Nombre = this.nombreServicioSeleccionado;
      this.servicioSeleccionado.Descripcion = this.descripcionServicioSeleccionado;

      this.serviciosService.modificarServicio(this.servicioSeleccionado)
        .subscribe({
          next: () => {
            this.obtenerServicios();

            Swal.fire({
              icon: 'success',
              title: 'Guardado',
              text: 'Servicio modificado exitosamente',
              timer: 1500,
              showConfirmButton: false,
              scrollbarPadding: false,
              heightAuto: false
            });
          },
          error: (err) => {
            console.error('Error al modificar servicio:', err);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al actualizar servicio, intenta con datos diferentes',
              scrollbarPadding: false,
              heightAuto: false
            });
          }
        });
    }

    confirmarEliminarPrecioSucursal(): void {

      if (!this.servicioSeleccionado || !this.servicioPorSucursalSeleccionado) {
        return;
      }

      this.showTogleUpdatePrecio = false;

      Swal.fire({
        title: '¿Eliminar precio?',
        text: 'Se eliminará el precio de esta sucursal',
        icon: 'warning',

        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',

        backdrop: true,
        reverseButtons: true,
        scrollbarPadding: false,
        heightAuto: false
      }).then((result) => {

        if (!result.isConfirmed) {
          this.showTogleUpdatePrecio = true;
          return;
        }

        this.eliminarPrecioSucursal(); // 🔥 acción real
      });
    }
    
    eliminarPrecioSucursal(): void {

      if (!this.servicioSeleccionado || !this.servicioPorSucursalSeleccionado) {
        return;
      }

      // 🔥 quitamos la relación precio–sucursal
      this.servicioSeleccionado.ServiciosPorSucursal =
        this.servicioSeleccionado.ServiciosPorSucursal
          .filter(sp => sp.IdSucursal !== this.servicioPorSucursalSeleccionado.IdSucursal);

      this.serviciosService.modificarServicio(this.servicioSeleccionado).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Precio eliminado de la sucursal',
            life: 3000
          });

          this.showTogleUpdatePrecio = false;
          this.obtenerServicios();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el precio',
            life: 3000
          });

          // opcional: reabrir modal
          this.showTogleUpdatePrecio = true;
        }
      });
    }



    confirmarEliminarServicio(): void {
      if (!this.servicioSeleccionado?.ID) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Selecciona un servicio',
          life: 5000
        });
        return;
      }

      Swal.fire({
        title: 'Confirmar eliminación',
        text: '¿Seguro que deseas eliminar el servicio?',
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
          this.eliminarServicio(); // 🔥 aquí sí elimina
        }
      });
    }

  
    eliminarServicio(): void {
      if (!this.servicioSeleccionado?.ID) {
        return;
      }

      this.serviciosService.eliminarServicio(this.servicioSeleccionado.ID)
        .subscribe({
          next: () => {
            this.obtenerServicios();
            this.servicioSeleccionado = null;

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Servicio eliminado correctamente',
              timer: 1500,
              showConfirmButton: false,
              scrollbarPadding: false,
              heightAuto: false
            });
          },
          error: (err) => {
            console.error('Error al eliminar servicio:', err);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el servicio',
              scrollbarPadding: false,
              heightAuto: false
            });
          }
        });
    }


    obtenerSucursales(): void {
      this.sucursalesService.obtenerSucursales().subscribe({
        next: (response: any) => {
          console.log('Respuesta de la API:', response);
    
          if (response && response.data && Array.isArray(response.data)) {
            this.sucursales = response.data;
          } else {
            console.error('La API no devolvió un array dentro de "data".', response);
            this.sucursales = [];
          }
          
          this.obtenerServicios();
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error obtener sucursales', life: 10000});
          console.error('Error obteniendo sucursales:', err);
        }
      });
    }

    getNombreSucursal(id: string): string {
      const sucursal = this.sucursales.find(s => s.ID === id);
      return sucursal ? sucursal.Nombre : 'Sucursal desconocida';
    }
  
    limpiarFormulario(): void {
      this.nuevoServicio = {
        nombre: '',
        descripcion: ''
      };
    }

    showToglePrecio: boolean = false;
    showTogleUpdatePrecio: boolean = false;
    precioAnterior: number | null = null;
    servicioPorSucursalSeleccionado: ServicioPorSucursal = {
      IdSucursal: '',
      Precio: 0,
      FechaCreacion: null,
      CreadoPor: null
    };

    cancelarUpdatePrecio() 
    {
      if 
      (
        this.precioAnterior !== null &&
        this.servicioPorSucursalSeleccionado
      ) 
      {
        this.servicioPorSucursalSeleccionado.Precio = this.precioAnterior;
      }

      this.showTogleUpdatePrecio = false;
    }

    handleClickUpdatePrecio(servicio: Servicio, servicioPorSucursal: ServicioPorSucursal) {
        this.servicioSeleccionado = servicio;
        this.servicioPorSucursalSeleccionado = servicioPorSucursal;
        this.precioAnterior = servicioPorSucursal.Precio;
        this.showTogleUpdatePrecio = !this.showTogleUpdatePrecio;
      }

    handleClickAddPrecio(servicio: Servicio) {
        this.servicioSeleccionado = servicio;

        this.filtrarSucursalesDisponibles();
        this.showToglePrecio = !this.showToglePrecio;
      }

    filtrarSucursalesDisponibles(): void {
      if (!this.servicioSeleccionado?.ServiciosPorSucursal) {
        this.sucursalesDisponibles = [...this.sucursales];
        return;
      }

      const sucursalesConPrecio = this.servicioSeleccionado.ServiciosPorSucursal
        .map(sp => sp.IdSucursal);

      this.sucursalesDisponibles = this.sucursales.filter(
        suc => !sucursalesConPrecio.includes(suc.ID)
      );
    }

    guardarUpdatePrecio() {
      if (!this.servicioSeleccionado) {
        return;
      }
      this.showTogleUpdatePrecio = false;
      // Swal SOLO para confirmar
        Swal.fire({
          title: '¿Guardar cambios?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          backdrop: true,
          scrollbarPadding: false,
          reverseButtons: true,
          heightAuto: false
        }).then((result) => {

          if (!result.isConfirmed){
            this.showTogleUpdatePrecio = true;
            return;
          } 
          if (!this.servicioSeleccionado) {
            return;
          }

          this.serviciosService.modificarServicio(this.servicioSeleccionado).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Precio modificado correctamente',
                life: 3000
              });

              this.showTogleUpdatePrecio = false;
              this.obtenerServicios();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el precio',
                life: 3000
              });
            }
          });
        });

    }



    guardarPrecio(): void {
      if (!this.servicioSeleccionado || !this.sucursalSeleccionadaId || this.nuevoPrecio === null) {
        return;
      }

      if (!this.servicioSeleccionado.ServiciosPorSucursal) {
        this.servicioSeleccionado.ServiciosPorSucursal = [];
      }

      const nuevoDetalle: ServicioPorSucursal = {
        IdSucursal: this.sucursalSeleccionadaId,
        Precio: this.nuevoPrecio,
        FechaCreacion: null,
        CreadoPor: null
      };

      // 👉 PUSH NECESARIO
      this.servicioSeleccionado.ServiciosPorSucursal.push(nuevoDetalle);

      // Guardamos índice para posible rollback
      const index = this.servicioSeleccionado.ServiciosPorSucursal.length - 1;

      this.serviciosService.modificarServicio(this.servicioSeleccionado).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Precio agregado correctamente',
            life: 8000
          });

          this.sucursalSeleccionadaId = null;
          this.closeMessagePrecio();
          this.obtenerServicios();
        },
        error: (err) => {
          console.error('Error al guardar precio:', err);

          // 🔥 rollback SOLO si falla el PUT
          this.servicioSeleccionado?.ServiciosPorSucursal.splice(index, 1);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el precio. Cambio revertido',
            life: 8000
          });
        }
      });
    }


    closeMessagePrecio() {
      this.closeModal();
    }

    closeModal() {
      this.showToglePrecio = false;
      this.nuevoPrecio = 0;
    }

  limpiarPrecio(): void {
    if (this.nuevoPrecio === 0) {
      this.nuevoPrecio = null;
    }
  }

  onPrecioInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nuevoPrecio = value === '' ? null : Number(value);
  }

}
