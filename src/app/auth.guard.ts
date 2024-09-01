import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Validar si localStorage está disponible y accesible
  const isLocalStorageLoaded = typeof window !== 'undefined' && !!window.localStorage;

  if (!isLocalStorageLoaded) {
    console.error('LocalStorage no está disponible o no está cargado.');
    return false;
  }

  return !!localStorage.getItem('authToken') ? true : router.navigate(['/login']);
};