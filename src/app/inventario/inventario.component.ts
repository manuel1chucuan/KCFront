import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // necesario para operativas básicas en HTML (ngFor, ngIf, etc.)
import { FormsModule } from '@angular/forms'; // necesario para habilitar ngModel en el HTML
import { CrearProducto, Producto, Sucursal, ProductoPorSucursal } from '../models/modelos';
import { ProductosService } from '../services/web-services-productos.service';
import { SucursalesService } from '../services/web-services-sucursales.service';
import { MessageService } from 'primeng/api'; // imprime notificaciones
import { PrimeNGConfig } from 'primeng/api'; // para habilitar efecto ripple
import { DialogModule } from 'primeng/dialog'; // CLEANUP o TODO: no se usa. Usar o quitar
import { ButtonModule } from 'primeng/button'; // CLEANUP o TODO: no se usa. Usar o quitar
import { ToastModule } from 'primeng/toast'; // importa el tag <p-toast> en el componente
import { MessagesModule } from 'primeng/messages'; // CLEANUP o TODO: no se usa. Usar o quitar
// renderiza alerts
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule, DialogModule, MessagesModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent {

      nuevoProducto: CrearProducto = {
        nombre: '',
        descripcion: ''
      };
  
      nuevoDetalleDelProducto: ProductoPorSucursal = {
        idSucursal: '',
        precio: 0,
        stock: 0,
        fechaCreacion: null,
        creadoPor: null
      };
    
      productos: Producto[] = [];
      sucursales: Sucursal[] = [];
      sucursalesDisponibles: Sucursal[] = [];
    
      constructor(private productosService: ProductosService,private sucursalesService: SucursalesService, 
        private primengConfig: PrimeNGConfig , private messageService: MessageService) {}
    
      ngOnInit() {
        // habilita un efecto animado en componentes primeng
        // REFACTOR: esta línea debería existir una sola vez en AppComponent, con eso aplica en toda la app
        this.primengConfig.ripple = true; 
        this.obtenerSucursales(); // Cargar sucursales al iniciar el componente
      }
    
      // al hacer click en Agregar Producto
      crearProducto(): void {
        // valida que el input Producto no esté vacío 
        if (!this.nuevoProducto.nombre) {
          console.log('El nombre del producto es obligatorio.');
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'El nombre del producto es obligatorio.', life: 10000});
          return;
        }
    
        // crea un nuevo servicio a travez través de ServiciosService
        this.productosService.crearProducto(this.nuevoProducto).subscribe({
          next: (response) => {
            console.log('Producto creado:', response);
            this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Producto creado exitosamente.', life: 10000});
            // limpia el formulario Agregar Producto
            this.limpiarFormulario();
            // obtiene nuevamente los productos para renderizar el nuevo producto agregado
            this.obtenerProductos();
          },
          error: (err) => {
            console.error('Error al crear el producto:', err);
            // IMPROVEMENT: "Intente con otro nombre". El error puede deberse a otras razones.
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al crear el producto. Intente con otro nombre', life: 10000});
          }
        });
      }
    
      // obtiene los productos a través de productosService
      obtenerProductos(): void {
        this.productosService.obtenerProductos().subscribe({
          next: (response: any) => {
            console.log('Respuesta de la API:', response);
      
            if (response && response.data && Array.isArray(response.data)) {
              // guarda la respuesta en this.productos
              this.productos = response.data;   
              this.productoSeleccionado = this.productos.find(s => s.id === this.productoSeleccionado?.id) ?? null;
            } else {
              console.error('La API no devolvió un array dentro de "data".', response);
              this.productos = [];
            }
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error obtener al obtener servicios', life: 10000});
            console.error('Error obteniendo servicios:', err);
          }
        });
      }
    
      // REFACTOR: variables declaradas en medio de la clase
  
      productoSeleccionado: Producto | null = null; 
      nombreProductoSeleccionado: string = ""; // CLEANUP: variable innecesaria, puede usarse this.ProductoSeleccionado.Nombre
      descripcionProductoSeleccionado: string = ""; // CLEANUP: variable innecesaria, puede usarse this.ProductoSeleccionado.Descripcion
      pestanaActiva: string = 'agregarProducto';
      nuevoPrecio: number | null = null;
      sucursalSeleccionadaId: string | null = null;
    
      // al hacer click en cualquier servicio
      // recibe el servicio seleccionado
      seleccionarProducto(producto: Producto): void {
        this.productoSeleccionado = producto;
        // CLEANUP: variables innecesarias 
        this.nombreProductoSeleccionado = this.productoSeleccionado.nombre;
        this.descripcionProductoSeleccionado = this.productoSeleccionado.descripcion;
  
        // "navega" a la pestaña Gestión de Productos en el lado izquiero del componente
        this.pestanaActiva = 'gestionProductos';
      }
    
      // al hacer click en Guardar Cambios
      // modifica un servicio
      confirmarGuardarCambios(): void {
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado) {
          return;
        }
  
        // Validación previa (antes de preguntar)
        // IMPROVEMENT: usar "this.ProductoSeleccionado.Nombre"
        if (!this.nombreProductoSeleccionado) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre es obligatorio',
            life: 5000
          });
          return;
        }
  
        // renderiza el alert de confirmación para modificar un servicio
        Swal.fire({
          title: 'Guardar cambios',
          text: '¿Deseas guardar los cambios realizados en el producto?',
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
  
      // al hacer click en Guardar en el alert de confirmación para modificar un producto
      guardarCambios(): void {
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado) {
          return;
        }
  
        // CLEANUP: innecesario
        this.productoSeleccionado.nombre = this.nombreProductoSeleccionado;
        this.productoSeleccionado.descripcion = this.descripcionProductoSeleccionado;
  
        // modifica un producto a travez través de ProductosService
        this.productosService.modificarProducto(this.productoSeleccionado)
          .subscribe({
            next: () => {
              // obtiene nuevamente los productos para renderizar el servicio modificado
              this.obtenerProductos();
  
              // renderiza un alert de exito
              Swal.fire({
                icon: 'success',
                title: 'Guardado',
                text: 'Producto modificado exitosamente',
                timer: 1500,
                showConfirmButton: false,
                scrollbarPadding: false,
                heightAuto: false
              });
            },
            error: (err) => {
              console.error('Error al modificar producto:', err);
              // renderiza un alert de error
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar producto, intenta con datos diferentes',
                scrollbarPadding: false,
                heightAuto: false
              });
            }
          });
      }
  
      // al hacer click en Eliminar Precio en el modal de sucursal
      confirmarEliminarPrecioSucursal(): void {
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado || !this.productoPorSucursalSeleccionado) {
          return;
        }
  
        // cierra el modal de sucursal
        this.showTogleUpdatePrecio = false;
  
        // renderiza un alert de confirmación para eliminar un precio
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
  
          // al dar click en Cancelar en el alert de confirmación para eliminar un precio,
          // se vuelve a renderizar el modal de secursal
          if (!result.isConfirmed) {
            this.showTogleUpdatePrecio = true;
            return;
          }
  
          this.eliminarPrecioSucursal(); // 🔥 acción real
        });
      }
      
    // al hacer click en Eliminar en el alert de confirmación para eliminar un precio
      eliminarPrecioSucursal(): void {
  
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado || !this.productoPorSucursalSeleccionado) {
          return;
        }
  
        // elimina un ServiciosPorSucursal de el Servicio 
        // 🔥 quitamos la relación precio–sucursal
        this.productoSeleccionado.productoPorSucursal =
          this.productoSeleccionado.productoPorSucursal
            .filter(sp => sp.idSucursal !== this.productoPorSucursalSeleccionado.idSucursal);
  
        // petición para modificar el Servicio eliminandole un ServicioPorSucursal
        this.productosService.modificarProducto(this.productoSeleccionado).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Precio eliminado de la sucursal',
              life: 3000
            });
  
            // cierra el modal de sucursal
            this.showTogleUpdatePrecio = false;
            // obtiene nuevamente los productos para renderizar el servicio modificado sin el precio
            this.obtenerProductos();
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
  
  
      // al hacer click en Eliminar Servicio
      confirmarEliminarProducto(): void {
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado?.id) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atención',
            detail: 'Selecciona un servicio',
            life: 5000
          });
          return;
        }
  
        // renderiza alert de confirmación para eliminar un servicio
        Swal.fire({
          title: 'Confirmar eliminación',
          text: '¿Seguro que deseas eliminar el producto?',
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
            this.eliminarProducto(); // 🔥 aquí sí elimina
          }
        });
      }
  
    // al hacer click en Eliminar producto en el alert de confirmación para eliminar un producto
      eliminarProducto(): void {
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado?.id) {
          return;
        }
  
        // petición para eliminar el producto
        this.productosService.eliminarProducto(this.productoSeleccionado.id)
          .subscribe({
            next: () => {
              // obtiene nuevamente los productos para solo renderizar los no eliminados
              this.obtenerProductos();
              this.productoSeleccionado = null; // el contenido en pestaña Gestión de Servicio desaparece
  
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'Producto eliminado correctamente',
                timer: 1500,
                showConfirmButton: false,
                scrollbarPadding: false,
                heightAuto: false
              });
            },
            error: (err) => {
              console.error('Error al eliminar producto:', err);
  
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el producto',
                scrollbarPadding: false,
                heightAuto: false
              });
            }
          });
      }
  
      // obtiene las sucursales a través de SucursalesService
      obtenerSucursales(): void {
        this.sucursalesService.obtenerSucursales().subscribe({
          next: (response: any) => {
            console.log('Respuesta de la API:', response);
      
            // guarda la respuesta en this.sucursales
            if (response && response.data && Array.isArray(response.data)) {
              this.sucursales = response.data;
            } else {
              console.error('La API no devolvió un array dentro de "data".', response);
              this.sucursales = [];
            }
            
            // despues de obtenes las sucursales, se obtienen los productos
            this.obtenerProductos();
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error obtener sucursales', life: 10000});
            console.error('Error obteniendo sucursales:', err);
          }
        });
      }
  
      // renderiza el nombre de una sucursal,
      // recibe el id de un ServicioPorSucursal
      getNombreSucursal(id: string): string {
        // el id ServicioPorSucursal siempre es el mismo id que una Sucursal
        const sucursal = this.sucursales.find(s => s.id === id);
        return sucursal ? sucursal.nombre : 'Sucursal desconocida';
      }
    
      // limpia el formulario Agregar Servicio
      limpiarFormulario(): void {
        this.nuevoProducto = {
          nombre: '',
          descripcion: ''
        };
      }
  
    // REFACTOR: más variables declaradas en medio de la clase
  
      showToglePrecio: boolean = false;
      showTogleUpdatePrecio: boolean = false;
      precioAnterior: number | null = null;
      productoPorSucursalSeleccionado: ProductoPorSucursal = {
        idSucursal: '',
        precio: 0,
        stock: 0,
        fechaCreacion: null,
        creadoPor: null
      };
  
      // al dar click en Cancelar en el modal de sucursal,
      // o al dar click en cualquier parte fuera del modal de sucursal
      cancelarUpdatePrecio() 
      {
        // si existe "un precio anterior" de una sucursal (se ha intentado modificar el precio),
        // y se ha seleccionado alguna sucursal (TODO: imposible?)
        if 
        (
          this.precioAnterior !== null &&
          this.productoPorSucursalSeleccionado
        )
        // el precio del ServicioPorSucursal seleccionado regresa al precio original
        // (se cancela la modificación del precio)  
        {
          this.productoPorSucursalSeleccionado.precio = this.precioAnterior;
        }
  
        // cierra el modal de sucursal
        this.showTogleUpdatePrecio = false;
      }
  
      // al hacer click en una sucursal,
      // recibe el Servicio al que pertenece la sucursal y el ServicioPorSucural al que
      // pertenece el Servicio
      handleClickUpdatePrecio(producto: Producto, ProductoPorSucursal: ProductoPorSucursal) {
          this.productoSeleccionado = producto;
          // setea this.productoPorSucursalSeleccionado 
          this.productoPorSucursalSeleccionado = ProductoPorSucursal;
          // el "precio anterior" es el precio original con el que se creó el ProductoPorSucursal
          this.precioAnterior = ProductoPorSucursal.precio;
          // renderiza el modal de sucursal
          // IMPROVEMENT: simplemente igualar a true
          this.showTogleUpdatePrecio = !this.showTogleUpdatePrecio;
        }
  
      // al hacer click en el ícono para agregar una sucursal,
      // recibe el Servicio al que pertenece la sucursal
      handleClickAddPrecio(producto: Producto) {
        // CLEANUP: innecesario. al hacer click a una sucursal también se esta haciendo click a
        // un servicio (propagation), activando seleccionarServicio, el cual ya setea ProductoSeleccionado
          this.productoSeleccionado = producto;
  
          this.filtrarSucursalesDisponibles();
  
        // renderiza el modal para agregar sucursal
        // IMPROVEMENT: simplemente igualar a true
          this.showToglePrecio = !this.showToglePrecio;
        }
  
    // setea sucursalesDisponibles filtrando las sucursales que YA pertenecen al servicio seleccionado
      filtrarSucursalesDisponibles(): void {
        // si el Servicio seleccionado no tiene ServiciosPorSucursal
        // CLEANUP: imposible aunque un servicio no tenga nada en ServiciosPorSucursal,
        // el valor de su propiedad ServiciosPorSucursal será al menos "[]"
        if (!this.productoSeleccionado?.productoPorSucursal) {
          // setea sucursalesDisponibles con todas las sucursales (obtenidas en ngOnInit)
          this.sucursalesDisponibles = [...this.sucursales];
          return;
        } 
  
        // IMPROVEMENT: las sucursales "con precio" son las ids de las sucursales del servicio seleccionado??
        // el nombre de la variable confunde ya que el precio no parece tener nada que ver
        const sucursalesConPrecio = this.productoSeleccionado.productoPorSucursal
          .map(sp => sp.idSucursal);
  
        // setea sucursalesDisponibles filtrando las sucursales que YA pertenecen al servicio seleccionado
        this.sucursalesDisponibles = this.sucursales.filter(
          suc => !sucursalesConPrecio.includes(suc.id)
        );
  
      }
  
      // al hacer click en Guardar en el modal de sucursal
      guardarUpdatePrecio() {
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado) {
          return;
        }
        // se cierra el modal de sucursal
        // CLEANUP: para qué cerrar el modal antes de renderizar el alert de confirmación?
        // además se vuelve a cerrar más adelante
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
              this.showTogleUpdatePrecio = true; // CLEANUP: si no se cierra antes, no hay necesidad de abrirlo aquí
              return;
            } 
            // debido al código asíncrono, nuevamente se valida para prevenir errores de sistema (mal estado)
            if (!this.productoSeleccionado) {
              return;
            }
  
            // petición para modificar el servicio seleccionado (las modificaciones fueron echas
            // en la función onPrecioInput)
            this.productosService.modificarProducto(this.productoSeleccionado).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Producto modificado correctamente',
                  life: 3000
                });
  
                // se cierra el modal de sucursal
                this.showTogleUpdatePrecio = false;
                // se vuelven a obtener los productos para reflejar las modificaciones
                this.obtenerProductos();
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
  
      // al hacer click en Guardar en el modal para agregar una sucursal
      guardarPrecio(): void {
        // validación para prevenir errores de sistema (mal estado)
        if (!this.productoSeleccionado || !this.sucursalSeleccionadaId || this.nuevoPrecio === null) {
          return;
        }
  
        // CLEANUP: imposible. Todos los servicios tienen el valor de ServiciosPorSucursal 
        // en minimamente "[]"
        if (!this.productoSeleccionado.productoPorSucursal) {
          this.productoSeleccionado.productoPorSucursal = [];
        }
  
        // el "nuevo detalle" es un nuevo ServicioPorSucursal agregado al servicio seleccionado
        const nuevoDetalle: ProductoPorSucursal = {
          idSucursal: this.sucursalSeleccionadaId, // se crea con la misma id que la sucursal seleccionada
          precio: this.nuevoPrecio, // nuevoPrecio es seteado en onPrecioInput
          stock: 0,
          fechaCreacion: null,
          creadoPor: null
        };
  
        // 👉 PUSH NECESARIO
        this.productoSeleccionado.productoPorSucursal.push(nuevoDetalle);
  
        // Guardamos índice para posible rollback
        const index = this.productoSeleccionado.productoPorSucursal.length - 1;
  
        // petición para modificar el producto agregandole un nuevo serviciosPorSucursal
        this.productosService.modificarProducto(this.productoSeleccionado).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Precio agregado correctamente',
              life: 8000
            });
  
            this.sucursalSeleccionadaId = null; // se actualiza a null ya que se hace una modificación en la API
            this.closeMessagePrecio();
            // se obtienen los servicios nuevamente para reflejar los cambios
            this.obtenerProductos();
          },
          error: (err) => {
            console.error('Error al guardar precio:', err);
  
            // 🔥 rollback SOLO si falla el PUT
            this.productoSeleccionado?.productoPorSucursal.splice(index, 1);
  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo guardar el precio. Cambio revertido',
              life: 8000
            });
          }
        });
      }
  
  
      // cierra el modal para agregar una sucursal
      // IMPROVEMENT: por qué no usar directamente closeModal en el componente?
      closeMessagePrecio() {
        this.closeModal();
      }
  
    // cierra el modal para agregar una sucursal
      closeModal() {
        this.showToglePrecio = false;
        // limpia el input de precio en el modal para agregar sucursal
        // IMPROVEMENT: por qué no null como en la función limpiarPrecio?
        this.nuevoPrecio = 0; 
      }
  
    // gracias a esta función, al abrir el modal para agregar una sucursal, el input para el precio
    // aparece vacío, y no en 0. También al cambiar el valor a 0 y "enfocar" el input
    limpiarPrecio(): void {
      if (this.nuevoPrecio === 0) {
        this.nuevoPrecio = null;
      }
    }
  
    // al modificar el input para el precio en el modal para agregar una sucursal,
    onPrecioInput(event: Event): void {
      // setea el valor de nuevoPrecio con el valor númerico ingresado
      const value = (event.target as HTMLInputElement).value;
      this.nuevoPrecio = value === '' ? null : Number(value);
    }
  
}
