import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearProducto, Producto  } from '../models/modelos';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// con @Injectable, Angular instancia la clase e inyecta sus dependencias al ser necesitada por primera vez
@Injectable({
  providedIn: 'root', // existe una sola instancia del servicio en toda la aplicación
})
export class ProductosService {
  private apiUrl = environment.apiUrl+ "/productos";
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Agregamos el token en el header
    });
  }

  // Crear un nuevo producto
  crearProducto(producto: CrearProducto): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}`, producto, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error creando producto:', error);
          throw error;
        })
      );
  }

  //Modificar un producto
  modificarProducto(producto: Producto): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/${producto.id}`, producto, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al modificar producto:', error);
          throw error;
        })
      );
  }

  //Eliminar un producto
  eliminarProducto(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar producto:', error);
          throw error;
        })
      );
  }

  // Obtener todos los productos
  obtenerProductos(): Observable<{ data: Producto[] }> {
    return this.http
      .get<{ data: Producto[] }>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo productos:', error);
          throw error;
        })
      );
  }

  // Obtener un producto por su ID
  obtenerUnProductoPorId(id: string): Observable<Producto> {
    return this.http
      .get<Producto>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(`Error obteniendo el producto por ID ${id}:`, error);
          throw error;
        })
      );
  }
}
