import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearUsuario, Usuario } from '../objetos/usuario';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/usuario';

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

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.apiUrl}/consultartodos`, { headers: this.getHeaders() })
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
