import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss'
})

export class CajaComponent {

  constructor(private authService: AuthServiceService, private router: Router) { }

  onLogOut(): void {
    this.authService.logout();
  }

  selectHabilidad(habilidad: string) {

  }
}
