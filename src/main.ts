import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// punto de inicio de la aplicación
// inicializa la aplicación con el componente AppComponent y la configuración appConfig
bootstrapApplication(AppComponent, appConfig)
  // en caso de error en la inicialización, se imprime el error en la consola
  .catch((err) => console.error(err));
