import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class AuthServiceService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) { }

  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { correo, contrasena })
      .pipe(
        tap((response: any) => localStorage.setItem('authToken', response.token)),
        catchError(this.handleError<any>('login'))
      );
  }
  
  private handleError<T>(operation = 'operation'): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(error.message));
    };
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

}
