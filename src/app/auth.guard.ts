import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// función que permite el acceso a un componente, o redirecciona a inicio
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Validar si localStorage está disponible y accesible
  const isSessionStorage = typeof window !== 'undefined' && !!window.sessionStorage;

  if (!isSessionStorage) {
    console.error('LocalStorage no está disponible o no está cargado.');
    return false;
  }

  // retorna true si hay token en sessionStorage
  // rediriecciona a inicio en caso contrario
  // TODO: el token no esta siendo validado 
  return !!sessionStorage.getItem('authToken') ? true : router.navigate(['']);
};
