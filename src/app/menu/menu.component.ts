import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CajaComponent } from '../caja/caja.component';
import { FiltroPrincipal } from '../services/fliltro-principal.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule, CommonModule, CajaComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  selectedValue: number = 8;
  filtro: string = '';
  showTogle: boolean = false; // Controla la visibilidad del mensaje
  showTogle2: boolean = false; // Controla la visibilidad del mensaje
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
  constructor(private authService: AuthServiceService, private router: Router, private dataService: FiltroPrincipal) { }

  onLogOut(): void {
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
