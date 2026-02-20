import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';  // Importa HttpClient
import { MessageService } from 'primeng/api'; // 🔥 Importar MessageService

// las configuraciones de la app
export const appConfig: ApplicationConfig = {
  // los providers
  providers: [
    // provider de rutas
    provideRouter(routes),
    // se conecta al HTML ya renderizado en el servidor, para mejor performance
    provideClientHydration(),
    // permite el funcionamiento de primeg y otras animaciones (como ripple)
    provideAnimations(),
    // provider de cliente http para hacer peticiones
    provideHttpClient(withInterceptorsFromDi()), // Añadir provideHttpClient aquí
    // crea una instancia global de MessageService (para notificaciones). 
    // No definirlo como provider crearía una instancia por cada componente en el que se importa
    MessageService
  ]
};