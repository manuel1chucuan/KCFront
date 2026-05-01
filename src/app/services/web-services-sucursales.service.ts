import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AsignacionSucursal, CrearSucursal, Sucursal } from '../models/modelos';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// con @Injectable, Angular instancia la clase e inyecta sus dependencias al ser necesitada por primera vez
@Injectable({
  providedIn: 'root', // existe una sola instancia del servicio en toda la aplicación
})
export class SucursalesService {
  private apiUrl = environment.apiUrl + "/sucursales";
  private readonly tokenSucursalStorageKey = 'tokenSucursal';
  private readonly sucursalAsignadaStorageKey = 'sucursalAsignada';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Agregamos el token en el header
    });
  }

  asignarSucursal(sucursalId: string): Observable<{ data: AsignacionSucursal }> {
    return this.http
      .post<{ data: AsignacionSucursal }>(`${this.apiUrl}/asignacion`, { sucursalId }, { headers: this.getHeaders() })
      .pipe(
        tap((response) => this.guardarSucursalAsignada(response.data.tokenSucursal, response.data.sucursal)),
        catchError((error) => {
          console.error('Error asignando sucursal:', error);
          throw error;
        })
      );
  }

  // Crear un nuevo usuario
  crearSucursal(sucursal: CrearSucursal): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}`, sucursal, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error creando sucursal:', error);
          throw error;
        })
      );
  }

  modificarSucursal(sucursal: Sucursal): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/${sucursal.id}`, sucursal, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al modificar sucursal:', error);
          throw error;
        })
      );
  }

  eliminarSucursal(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar sucursal:', error);
          throw error;
        })
      );
  }

  // Obtener todos los usuarios
  obtenerSucursales(): Observable<{ data: Sucursal[] }> {
    return this.http
      .get<{ data: Sucursal[] }>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo sucursales:', error);
          throw error;
        })
      );
  }

  // Obtener un usuario por su ID
  obtenerUnaSucursalPorId(id: string): Observable<Sucursal> {
    return this.http
      .get<Sucursal>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(`Error obteniendo la sucursal con ID ${id}:`, error);
          throw error;
        })
      );
  }

  tieneSucursalAsignadaValida(): boolean {
    const tokenSucursal = this.obtenerTokenSucursalGuardado();
    if (!tokenSucursal) {
      return false;
    }

    const claims = this.extraerClaimsTokenSucursal(tokenSucursal);
    if (!claims) {
      this.limpiarSucursalAsignada();
      return false;
    }

    return true;
  }

  obtenerSucursalAsignada(): Sucursal | null {
    if (!this.tieneSucursalAsignadaValida() || !this.tieneLocalStorage()) {
      return null;
    }

    const sucursalGuardada = localStorage.getItem(this.sucursalAsignadaStorageKey);
    if (!sucursalGuardada) {
      return null;
    }

    try {
      return JSON.parse(sucursalGuardada) as Sucursal;
    } catch (error) {
      console.error('No fue posible leer la sucursal asignada.', error);
      return null;
    }
  }

  obtenerSucursalAsignadaId(): string | null {
    const tokenSucursal = this.obtenerTokenSucursalGuardado();
    if (!tokenSucursal) {
      return null;
    }

    const claims = this.extraerClaimsTokenSucursal(tokenSucursal);
    if (!claims) {
      this.limpiarSucursalAsignada();
      return null;
    }

    return claims.sucursalId;
  }

  limpiarSucursalAsignada(): void {
    if (!this.tieneLocalStorage()) {
      return;
    }

    localStorage.removeItem(this.tokenSucursalStorageKey);
    localStorage.removeItem(this.sucursalAsignadaStorageKey);
  }

  private guardarSucursalAsignada(tokenSucursal: string, sucursal: Sucursal): void {
    if (!this.tieneLocalStorage()) {
      throw new Error('LocalStorage no está disponible.');
    }

    localStorage.setItem(this.tokenSucursalStorageKey, tokenSucursal);
    localStorage.setItem(this.sucursalAsignadaStorageKey, JSON.stringify(sucursal));
  }

  private obtenerTokenSucursalGuardado(): string | null {
    if (!this.tieneLocalStorage()) {
      return null;
    }

    return localStorage.getItem(this.tokenSucursalStorageKey);
  }

  private tieneLocalStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private extraerClaimsTokenSucursal(tokenSucursal: string): { exp: number; sucursalId: string; tokenType: string } | null {
    const parts = tokenSucursal.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload = this.decodificarBase64Url(parts[1]);
      const claims = JSON.parse(payload) as Partial<{ exp: number; sucursalId: string; tokenType: string }>;

      if (
        typeof claims.exp !== 'number' ||
        claims.exp <= Math.floor(Date.now() / 1000) ||
        typeof claims.sucursalId !== 'string' ||
        claims.sucursalId.length === 0 ||
        claims.tokenType !== 'sucursal'
      ) {
        return null;
      }

      return claims as { exp: number; sucursalId: string; tokenType: string };
    } catch (error) {
      console.error('No fue posible decodificar el token de sucursal.', error);
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
