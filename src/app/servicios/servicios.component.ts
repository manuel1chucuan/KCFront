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
    nuevoPrecio: number = 0;
    sucursalSeleccionadaId: string | null = null;
  
    seleccionarServicio(servicio: Servicio): void {
      this.servicioSeleccionado = servicio;
      this.nombreServicioSeleccionado = this.servicioSeleccionado.Nombre;
      this.descripcionServicioSeleccionado = this.servicioSeleccionado.Descripcion;
      this.pestanaActiva = 'gestionServicios';
    }
  
    guardarCambios(): void {
      
      if (!this.servicioSeleccionado ) {
        console.log('No hay servicio seleccionado.');
        return;
      }

      this.servicioSeleccionado.Nombre = this.nombreServicioSeleccionado;
      this.servicioSeleccionado.Descripcion = this.descripcionServicioSeleccionado;
      if (!this.servicioSeleccionado?.Nombre) {
        console.log('El nombre es obligatorio.');
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio.', life: 10000});
        return;
      }
      
      this.serviciosService.modificarServicio(this.servicioSeleccionado).subscribe({
        next: () => {
          console.log('Servicio modificado correctamente');
          this.obtenerServicios();
          this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Servicio modificado exitosamente.', life: 10000});
        },
        error: (err) => {
          console.error('Error al modificar servicio:', err);
          this.obtenerServicios();
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al actualizar servicio, por favor intenta con datos diferentes', life: 10000});
        }
      });
  
      console.log('Servicio actualizado:', this.servicioSeleccionado);
    }
  
    eliminarServicio(): void {
      if (!this.servicioSeleccionado?.ID) {
        console.log('Seleciona un servicio.');
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Seleciona un servicio.', life: 10000});
        return;
      }
      this.serviciosService.eliminarServicio(this.servicioSeleccionado.ID).subscribe({
        next: () => {
          console.log('Servicio eliminado correctamente');
          this.obtenerServicios();
          this.servicioSeleccionado = null;
          this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Servicio eliminado correctamente.', life: 10000});
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          this.obtenerServicios();
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar servicio', life: 10000});
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
      if (!this.servicioSeleccionado) {return;}
      this.serviciosService.modificarServicio(this.servicioSeleccionado).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Precio modificado correctamente',
            life: 8000
          });
          this.showTogleUpdatePrecio = false;
          this.obtenerServicios();
        },
        error: () => {
          // rollback si falla backend
          if (this.precioAnterior !== null) {
            this.servicioPorSucursalSeleccionado.Precio = this.precioAnterior;
          }
        }
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

}
