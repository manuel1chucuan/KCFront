import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// las configuraciones para Server-Side Rendering (SSR)
const serverConfig: ApplicationConfig = {
  providers: [
    // le dice a Angular: “Estás corriendo en servidor, no en navegador”
    provideServerRendering()
  ]
};

// toma toda la config normal (appConfig),
// y Le agrega cosas solo necesarias para SSR 
export const config = mergeApplicationConfig(appConfig, serverConfig);
