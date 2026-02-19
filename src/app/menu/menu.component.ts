import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // CLEANUP: no se usa
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms'; // necesario para habilitar ngModel en el HTML
import { CommonModule } from '@angular/common';  // necesario para operativas básicas en HTML (ngFor, ngIf, etc.)
import { CajaComponent } from '../caja/caja.component';
import { FiltroPrincipal } from '../services/fliltro-principal.service';
import { ServiciosComponent } from "../servicios/servicios.component";
import { EmpleadosComponent } from '../empleados/empleados.component';
import { InventarioComponent } from '../inventario/inventario.component';
import { SucursalesComponent } from '../sucursales/sucursales.component';
import { VentasComponent } from '../ventas/ventas.component';

// este componente dinámico contiene 6 vistas:
// caja, servicios, inventario, empleados, sucursales, y ventas
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
  FormsModule, RouterModule, CommonModule, CajaComponent, ServiciosComponent, EmpleadosComponent, 
    InventarioComponent, SucursalesComponent, VentasComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  selectedValue: number = 8;
  filtro: string = '';
  showTogle: boolean = false; // Controla la visibilidad del mensaje
  showTogle2: boolean = false; // Controla la visibilidad del mensaje

  componenteActual: string = 'caja'; // Componente inicial

  // en cada renderizado del componente, se obtiene el componenteActual almacenado 
  // en localStorage y el valor es asignado a this.componenteActual
  // esto es para que al refrescar la página se mantenga la misma vista
  ngOnInit() {
    const almacenado = localStorage.getItem('componenteActual');
    this.componenteActual = almacenado ? almacenado : 'caja'; // valor por defecto
  }

  // método para "navegar" entre las vistas cambiando el valor de this.componenteActual
  mostrarComponente(componente: string): void {
    this.componenteActual = componente;
    localStorage.setItem('componenteActual', componente);
    // cierra el menú de navegación
    this.closeMessage2();
  }

  // al dar click en Ajustes, se renderizan las configuraciones de la caja, o se ocultan
  handleClick() {
    this.showTogle = !this.showTogle; // Alterna la visibilidad del mensaje
  }

  // al dar click en cualquier parte de la pantalla (componentes con clase overlay), 
  // se ocultan las configuraciones de la caja
  closeMessage() {
    this.showTogle = false;
  }

  // al dar click en el menú, se renderizan las imagenes para cambiar de vista, o se ocultan
  handleClick2() {
    this.showTogle2 = !this.showTogle2; // Alterna la visibilidad del mensaje
  }

  // al dar click en cualquier parte de la pantalla (componentes con clase overlay), 
  // se ocultan las imagenes para cambiar de vista
  closeMessage2() {
    this.showTogle2 = false;
  }

  // REFACTOR: el constructor de esta clase esta en medio de los métodos
  constructor(private authService: AuthServiceService, private dataService: FiltroPrincipal) { }

  // cierra la sesión
  onLogOut(): void {
    // setea el componente actual a su valor default
    localStorage.setItem('componenteActual', 'caja');
    // cierra sesión a través del servicio AuthServiceService
    this.authService.logout();
  }

  // filtra el resultado de los productos en la vista de la caja
  aplicarFiltro(): void {
    console.log(this.filtro);
    // Realiza el filtrado de datos aquí
    const datosFiltrados = [""]; // Aplica tu lógica de filtro

    // Llama al método del servicio para establecer los datos filtrados
    this.dataService.setFilteredData(this.filtro);
  }
}
