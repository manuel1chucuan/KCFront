import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // CLEANUP: no se usan
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms'; // necesario para habilitar ngModel en el HTML
import { CommonModule } from '@angular/common'; // necesario para operativas básicas en HTML (ngFor, ngIf, etc.)
import { ButtonModule } from 'primeng/button'; // CLEANUP o TODO: no se usa. Usar o quitar
import { ToastModule } from 'primeng/toast'; // importa el tag <p-toast> en el componente
import { PrimeNGConfig } from 'primeng/api'; // para habilitar efecto ripple
import { MessageService } from 'primeng/api'; // imprime notificaciones
import { DialogModule } from 'primeng/dialog'; // CLEANUP o TODO: no se usa. Usar o quitar

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ButtonModule, ToastModule, DialogModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  constructor(private authService: AuthServiceService, private router: Router, private primengConfig: PrimeNGConfig, private messageService: MessageService) { }

  // función que se activa en cunato se renderiza el componente
  ngOnInit() {
    // REFACTOR: esta línea debería existir una sola vez en AppComponent, con eso aplica en toda la app
    this.primengConfig.ripple = true;
  }

  // se activa al presionar el botón "Iniciar sesion"
  // o al presionar "enter" en el campo "contraseña" 
  onLogin(): void {
    // regex para el formato del correo
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    console.log(emailPattern.test(this.correo));
    // si el correo no lleva el formato apropiado, se imprime un mensaje de error 
    // y finaliza la función
    if (!emailPattern.test(this.correo)) {
      // el mensaje de error se imprime a travás de MessageService,
      // de la dependencia primeng/api
      this.messageService.add({severity:'error', summary:'Error', detail:'Ingresa un correo Valido'});
      return;
    }

    // se valida que se haya ingrado una contraseña
    // TODO: la contraseña nunca es encriptada y queda expuesa en logs
    if (!this.contrasena) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Ingresa una contraseña'});
      return;
    }

    
    // inicio de sesión a través de AuthServiceService
    this.authService.login(this.correo, this.contrasena).subscribe({
      // next es lo que ocurre después de la ejecución del método
      // al cual se esta suscribiendo
      next: (response) => {
        // guarda un item en localStorage
        localStorage.setItem('componenteActual', 'caja');
        // navega a /menu
        this.router.navigate(['/menu']);
      },
      // si ocurre un error en la ejecución del método,
      // se captura aquí
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Correo o contraseña incorrectos'});
        console.log(err);
      }
    });
  }
}