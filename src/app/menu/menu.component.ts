import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CajaComponent } from '../caja/caja.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule, CommonModule, CajaComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  selectedValue: number = 8;
  showMessage: boolean = false; // Controla la visibilidad del mensaje
  handleClick() {
    this.showMessage = !this.showMessage; // Alterna la visibilidad del mensaje
  }
  closeMessage() {
    this.showMessage = false;
  }
  constructor(private authService: AuthServiceService, private router: Router) { }

  onLogOut(): void {
    this.authService.logout();
  }

  selectHabilidad(habilidad: string) {

  }
}
