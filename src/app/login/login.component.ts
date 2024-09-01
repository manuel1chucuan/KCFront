import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CajaComponent } from "../caja/caja.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule, CommonModule, CajaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthServiceService, private router: Router, private toastr: ToastrService) { }

  onLogin(): void {

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    console.log(emailPattern.test(this.correo));
    if (!emailPattern.test(this.correo)) {
      this.toastr.error('Error', 'Ingresa un correo Valido', {
        timeOut: 5000,
        progressBar:true,
      });
      return;
    }

    if (!this.contrasena) {
      this.toastr.error('Error', 'Ingresa una contraseña', {
        timeOut: 5000,
        progressBar:true,
      });
      return;
    }

    

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (response) => {
        console.log(1);
        console.log(response);
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        console.log(2);
        this.toastr.error('Error', 'Correo o contraseña incorrectos', {
          timeOut: 5000,
          progressBar:true,
        });
        console.log(err);
      }
    });
  }
}