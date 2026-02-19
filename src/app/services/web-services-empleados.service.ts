import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearUsuario, Usuario } from '../models/modelos';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// con @Injectable, Angular instancia la clase e inyecta sus dependencias al ser necesitada por primera vez
@Injectable({
  providedIn: 'root', // existe una sola instancia del servicio en toda la aplicación
})
export class UsuarioService {
  private apiUrl = environment.apiUrl + "/usuario" ;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Agregamos el token en el header
    });
  }

  // Crear un nuevo usuario
  crearUsuario(usuario: CrearUsuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.apiUrl}/insert`, usuario, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error creando usuario:', error);
          throw error;
        })
      );
  }

  modificarUsuario(usuario: Usuario): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/update/${usuario.ID}`, usuario, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al modificar usuario:', error);
          throw error;
        })
      );
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/eliminaruno/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar usuario:', error);
          throw error;
        })
      );
  }

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<{ data: Usuario[] }> {
    return this.http
      .get<{ data: Usuario[] }>(`${this.apiUrl}/consultartodos`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo usuarios:', error);
          throw error;
        })
      );
  }

  // Obtener un usuario por su ID
  obtenerUsuarioPorId(id: string): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.apiUrl}/consultaruno/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(`Error obteniendo el usuario con ID ${id}:`, error);
          throw error;
        })
      );
  }
}
