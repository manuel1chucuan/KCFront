import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CajaComponent } from '../caja/caja.component';
import { FiltroPrincipal } from '../services/fliltro-principal.service';
import { ServiciosComponent } from "../servicios/servicios.component";
import { EmpleadosComponent } from '../empleados/empleados.component';
import { InventarioComponent } from '../inventario/inventario.component';
import { SucursalesComponent } from '../sucursales/sucursales.component';
import { VentasComponent } from '../ventas/ventas.component';

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

  ngOnInit() {
    const almacenado = localStorage.getItem('componenteActual');
    this.componenteActual = almacenado ? almacenado : 'caja'; // valor por defecto
  }

  mostrarComponente(componente: string): void {
    this.componenteActual = componente;
    localStorage.setItem('componenteActual', componente);
    this.closeMessage2();
  }
  handleClick() {
    this.showTogle = !this.showTogle; // Alterna la visibilidad del mensaje
  }
  closeMessage() {
    this.showTogle = false;
  }

  handleClick2() {
    this.showTogle2 = !this.showTogle2; // Alterna la visibilidad del mensaje
  }
  closeMessage2() {
    this.showTogle2 = false;
  }
  constructor(private authService: AuthServiceService, private dataService: FiltroPrincipal) { }

  onLogOut(): void {
    localStorage.setItem('componenteActual', 'caja');
    this.authService.logout();
  }

  aplicarFiltro(): void {
    console.log(this.filtro);
    // Realiza el filtrado de datos aquí
    const datosFiltrados = [""]; // Aplica tu lógica de filtro

    // Llama al método del servicio para establecer los datos filtrados
    this.dataService.setFilteredData(this.filtro);
  }
}
