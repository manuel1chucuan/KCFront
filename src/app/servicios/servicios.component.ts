import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CrearServicio, Servicio } from '../models/modelos';
import { ServiciosService } from '../services/web-services-servicios.service';
import { MessageService } from 'primeng/api'; 
import { PrimeNGConfig } from 'primeng/api'; 
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages'; // 🔥 IMPORTANTE

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
  
    servicios: Servicio[] = []; // Lista de usuarios
  
    constructor(private serviciosService: ServiciosService, private primengConfig: PrimeNGConfig , private messageService: MessageService) {}
  
    ngOnInit() {
      this.primengConfig.ripple = true;
      this.obtenerServicios(); // Cargar usuarios al iniciar el componente
    }
  
    crearServicio(): void {
      if (!this.nuevoServicio.nombre) {
        console.log('El nombre del servicio es obligatorio.');
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre del servicio es obligatorio.', life: 10000});
        return;
      }
  
      this.serviciosService.crearServicio(this.nuevoServicio).subscribe({
        next: (servicioCreado) => {
          console.log('Usuario creado:', servicioCreado);
          this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Usuario creado exitosamente.', life: 10000});
          this.limpiarFormulario();
          this.obtenerServicios(); // Refrescar la lista después de crear un usuario
        },
        error: (err) => {
          console.error('Error al crear el usuario:', err);
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear el usuario. Intente con otro nombre u otro correo', life: 10000});
        }
      });
    }
  
    obtenerServicios(): void {
      this.serviciosService.obtenerServicios().subscribe({
        next: (response: any) => { // Se define como 'any' porque la API devuelve un objeto con 'data'
          console.log('Respuesta de la API:', response); // Verifica la estructura real
    
          if (response && response.data && Array.isArray(response.data)) {
            this.servicios = response.data; // Extrae solo la lista de usuarios
          } else {
            console.error('La API no devolvió un array dentro de "data".', response);
            this.servicios = []; // Evita errores asignando un array vacío
          }
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error obtener usuarios', life: 10000});
          console.error('Error obteniendo servicios:', err);
        }
      });
    }
  
    servicioSeleccionado: Servicio | null = null; 
    pestanaActiva: string = 'agregarServicio'; // 🔥 Cambié "pestañaActiva" a "pestanaActiva"
  
    seleccionarServicio(servicio: Servicio): void {
      this.servicioSeleccionado = servicio;
      this.pestanaActiva = 'gestionServicios'; // 🔥 También cambié aquí
    }
  
    // Método para guardar los cambios realizados
    guardarCambios(): void {
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
      // Aquí puedes agregar la lógica para enviar estos cambios al backend y actualizar la base de datos
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
  
    limpiarFormulario(): void {
      this.nuevoServicio = {
        nombre: '',
        descripcion: ''
      };
    }

}
