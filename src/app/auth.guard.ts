import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from './login/auth-service.service';

// función que permite el acceso a un componente, o redirecciona a inicio
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);

  // Validar si localStorage está disponible y accesible
  const isSessionStorage = typeof window !== 'undefined' && !!window.sessionStorage;

  if (!isSessionStorage) {
    console.error('LocalStorage no está disponible o no está cargado.');
    return false;
  }

  // retorna true si hay token en sessionStorage
  // rediriecciona a inicio en caso contrario
  return authService.isAuthenticated() ? true : router.navigate(['']);
};

// evita volver a inicio cuando ya existe una sesión activa
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);

  return authService.isAuthenticated() ? router.navigate(['/menu']) : true;
};
