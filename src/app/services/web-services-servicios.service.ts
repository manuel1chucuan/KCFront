import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearServicio, Servicio  } from '../models/modelos';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuerviciosService {
  private apiUrl = environment.apiUrl+ "/servicio";
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Agregamos el token en el header
    });
  }

  // Crear un nuevo servicio
  crearServicio(servicio: CrearServicio): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/insert`, servicio, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error creando servicio:', error);
          throw error;
        })
      );
  }

  //Modificar un servicio
  modificarServicio(servicio: Servicio): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/modificar/${servicio.ID}`, servicio, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al modificar servicio:', error);
          throw error;
        })
      );
  }

  //Eliminar un servicio
  eliminarServicio(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/eliminaruno/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar servicio:', error);
          throw error;
        })
      );
  }

  // Obtener todos los servicios
  obtenerServicios(): Observable<{ data: Servicio[] }> {
    return this.http
      .get<{ data: Servicio[] }>(`${this.apiUrl}/consultartodos`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo servicios:', error);
          throw error;
        })
      );
  }

  // Obtener un servicio por su ID
  obtenerUnaSucursalPorId(id: string): Observable<Servicio> {
    return this.http
      .get<Servicio>(`${this.apiUrl}/consultaruno/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(`Error obteniendo el servicio con ID ${id}:`, error);
          throw error;
        })
      );
  }
}
