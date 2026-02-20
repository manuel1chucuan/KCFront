import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// con @Injectable, Angular instancia la clase e inyecta sus dependencias al ser necesitada por primera vez
@Injectable({
  // WARNING: al ser 'any', podrían crearse múltiples sesiones a la vez. Cambiar a 'root'
  providedIn: 'any', // cada inyector puede tener su propia instancia
})
// servicio con métodos para autenticación
export class AuthServiceService {

  // obtenemos al url de la api a través de un objeto para 
  // variables de entorno globales
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  // método para inicio de sesión. Recibe correo y contraseña
  login(correo: string, contrasena: string): Observable<any> {
    // manda una petición al endpoint /login de la api a través del cliente http
    // con el correo y la contraseña en el body
    return this.http.post(`${this.apiUrl}/login`, { correo, contrasena })
    // como una pipa de agua. El "agua" es la respuesta de la petición.
    // una pipa puede tener varios "grifos"
      .pipe(
        // tap es un "grifo" en la pipa por el cual se puede extraer el agua para utilizarla.
        // en este caso, se obtiene el token de la respuesta y se guarda en sessionStorage
        tap((response: any) => sessionStorage.setItem('authToken', response.token)),
        // en caso de error, llamamos al método handleError para imprimir un mensaje 
        // que incluya "login" en él
        catchError(this.handleError<any>('login'))
      );
  }
  
  // método para cachar errores. Recibe una string que aparecerá en el mensaje de error
  // como la operación que falló
  private handleError<T>(operation = 'operation'): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(error.message));
    };
  }

  // método para cerrar sesión
  logout(): void {
    // se remueve el authToken de sessionStorage
    sessionStorage.removeItem('authToken');
    // redirección a /login
    this.router.navigate(['/login']);
  }

  // valida si el usuario esta autenticado
  isAuthenticated(): boolean {
    // obtiene el token de sessionStorage
    const token = sessionStorage.getItem('authToken');
    // regres true o false con respecto a si existe un valor en authToken
    // TODO: no valida el token! cualquier valor para authToken sirve!
    return !!token;
  }

}
