import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

type AuthPermissions = {
  admin: boolean;
  caja: boolean;
  inventario: boolean;
  servicio: boolean;
};

type AuthTokenClaims = AuthPermissions & {
  exp: number;
  nombre?: string;
};

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
  private nombreUsuario: string | null = null;
  private permisosUsuario: AuthPermissions | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.hidratarSesionDesdeToken();
  }

  // método para inicio de sesión. Recibe correo y contraseña
  login(correo: string, contrasena: string): Observable<any> {
    // manda una petición al endpoint /login de la api a través del cliente http
    // con el correo y la contraseña en el body
    return this.http.post(`${this.apiUrl}/login`, { correo, contrasena })
    // como una pipa de agua. El "agua" es la respuesta de la petición.
    // una pipa puede tener varios "grifos"
      .pipe(
        // tap es un "grifo" en la pipa por el cual se puede extraer el agua para utilizarla.
        // en este caso, se obtiene el token de la respuesta, se guarda
        // y se extraen nombre/permisos desde sus claims
        tap((response: any) => this.guardarSesion(response.token)),
        // en caso de error, llamamos al método handleError para imprimir un mensaje 
        // que incluya "login" en él
        catchError(this.handleError<any>('login'))
      );
  }

  // método para inicio de sesión del cajero con credenciales resueltas en backend
  loginCajero(): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/cajero`, {})
      .pipe(
        tap((response: any) => this.guardarSesion(response.token)),
        catchError(this.handleError<any>('loginCajero'))
      );
  }

  cambiarContrasena(contrasenaActual: string, nuevaContrasena: string, confirmacionContrasena: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/login/contrasena`, {
      contrasenaActual,
      nuevaContrasena,
      confirmacionContrasena,
    }, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError<any>('cambiarContrasena'))
      );
  }

  getNombreUsuario(): string | null {
    if (!this.nombreUsuario) {
      this.hidratarSesionDesdeToken();
    }

    return this.nombreUsuario;
  }

  getPermisosUsuario(): AuthPermissions | null {
    if (!this.permisosUsuario) {
      this.hidratarSesionDesdeToken();
    }

    return this.permisosUsuario ? { ...this.permisosUsuario } : null;
  }
  
  // método para cachar errores. Recibe una string que aparecerá en el mensaje de error
  // como la operación que falló
  private handleError<T>(operation = 'operation'): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      const errorMessage = error?.error?.error || error?.message || 'Ocurrió un error inesperado';
      console.error(`${operation} failed: ${errorMessage}`);
      return throwError(() => new Error(errorMessage));
    };
  }

  // método para cerrar sesión
  logout(): void {
    this.limpiarSesion();
    // redirección a /login
    this.router.navigate(['/']);
  }

  // valida si el usuario esta autenticado
  isAuthenticated(): boolean {
    const token = this.obtenerTokenGuardado();
    if (!token) {
      return false;
    }

    // en frontend sólo podemos validar estructura y expiración;
    // la firma real del token se valida en backend
    const claims = this.extraerClaims(token);
    if (!claims) {
      this.limpiarSesion();
      return false;
    }

    this.actualizarSesion(claims);
    return true;
  }

  private guardarSesion(token: string): void {
    if (!this.tieneSessionStorage()) {
      throw new Error('SessionStorage no está disponible.');
    }

    const claims = this.extraerClaims(token);
    if (!claims) {
      throw new Error('Token inválido o expirado.');
    }

    sessionStorage.setItem('authToken', token);
    this.actualizarSesion(claims);
  }

  private hidratarSesionDesdeToken(): void {
    const token = this.obtenerTokenGuardado();
    if (!token) {
      return;
    }

    const claims = this.extraerClaims(token);
    if (!claims) {
      this.limpiarSesion();
      return;
    }

    this.actualizarSesion(claims);
  }

  private actualizarSesion(claims: AuthTokenClaims): void {
    this.nombreUsuario = typeof claims.nombre === 'string' ? claims.nombre : null;
    this.permisosUsuario = {
      admin: claims.admin,
      caja: claims.caja,
      inventario: claims.inventario,
      servicio: claims.servicio,
    };
  }

  private limpiarSesion(): void {
    this.nombreUsuario = null;
    this.permisosUsuario = null;

    if (!this.tieneSessionStorage()) {
      return;
    }

    sessionStorage.removeItem('authToken');
  }

  private obtenerTokenGuardado(): string | null {
    if (!this.tieneSessionStorage()) {
      return null;
    }

    return sessionStorage.getItem('authToken');
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.obtenerTokenGuardado() ?? ''}`,
    });
  }

  private tieneSessionStorage(): boolean {
    return typeof window !== 'undefined' && !!window.sessionStorage;
  }

  private extraerClaims(token: string): AuthTokenClaims | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload = this.decodificarBase64Url(parts[1]);
      const claims = JSON.parse(payload) as Partial<AuthTokenClaims>;

      if (
        typeof claims.exp !== 'number' ||
        claims.exp <= Math.floor(Date.now() / 1000) ||
        typeof claims.admin !== 'boolean' ||
        typeof claims.caja !== 'boolean' ||
        typeof claims.inventario !== 'boolean' ||
        typeof claims.servicio !== 'boolean'
      ) {
        return null;
      }

      return claims as AuthTokenClaims;
    } catch (error) {
      console.error('No fue posible decodificar el token.', error);
      return null;
    }
  }

  private decodificarBase64Url(base64Url: string): string {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = window.atob(paddedBase64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return new TextDecoder().decode(bytes);
  }
}
