import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CajaComponent } from "../caja/caja.component";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, CajaComponent, ButtonModule, ToastModule, DialogModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthServiceService, private router: Router, private primengConfig: PrimeNGConfig, private messageService: MessageService) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  onLogin(): void {

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    console.log(emailPattern.test(this.correo));
    if (!emailPattern.test(this.correo)) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Ingresa un correo Valido'});
      return;
    }

    if (!this.contrasena) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Ingresa una contraseña'});
      return;
    }

    

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (response) => {
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Correo o contraseña incorrectos'});
        console.log(err);
      }
    });
  }
}