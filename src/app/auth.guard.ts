import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Validar si localStorage está disponible y accesible
  const isSessionStorage = typeof window !== 'undefined' && !!window.sessionStorage;

  if (!isSessionStorage) {
    console.error('LocalStorage no está disponible o no está cargado.');
    return false;
  }

  return !!sessionStorage.getItem('authToken') ? true : router.navigate(['/login']);
};