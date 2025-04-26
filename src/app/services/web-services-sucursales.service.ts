import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearSucursal, Sucursal, Usuario } from '../models/modelos';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SucursalesService {
  private apiUrl = 'http://localhost:8080/sucursal';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Agregamos el token en el header
    });
  }

  // Crear un nuevo usuario
  crearSucursal(sucursal: CrearSucursal): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/insert`, sucursal, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error creando sucursal:', error);
          throw error;
        })
      );
  }

  modificarSucursal(sucursal: Sucursal): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/modificar/${sucursal.ID}`, sucursal, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al modificar sucursal:', error);
          throw error;
        })
      );
  }

  eliminarSucursal(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/eliminaruna/${id}`, { headers: this.getHeaders() })
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
      .get<{ data: Sucursal[] }>(`${this.apiUrl}/consultartodas`, { headers: this.getHeaders() })
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
      .get<Sucursal>(`${this.apiUrl}/consultaruna/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(`Error obteniendo la sucursal con ID ${id}:`, error);
          throw error;
        })
      );
  }
}
