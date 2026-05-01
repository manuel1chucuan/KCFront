import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from './login/auth-service.service';
import { SucursalesService } from './services/web-services-sucursales.service';

// función que permite el acceso a un componente, o redirecciona a inicio
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  const sucursalesService = inject(SucursalesService);

  // Validar si localStorage está disponible y accesible
  const isSessionStorage = typeof window !== 'undefined' && !!window.sessionStorage;

  if (!isSessionStorage) {
    console.error('LocalStorage no está disponible o no está cargado.');
    return false;
  }

  if (!authService.isAuthenticated()) {
    return router.navigate(['']);
  }

  return sucursalesService.tieneSucursalAsignadaValida() ? true : router.navigate(['']);
};

// evita volver a inicio cuando ya existe una sesión activa
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  const sucursalesService = inject(SucursalesService);

  return authService.isAuthenticated() && sucursalesService.tieneSucursalAsignadaValida()
    ? router.navigate(['/menu'])
    : true;
};
