import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// NO levanta un servidor, solo exporta una función que sabe cómo inicializar Angular en modo SSR
const bootstrap = () => bootstrapApplication(AppComponent, config);

// es necesario exportar la función para que Angular la utilice internamente (en desarrollo/ng serve),
// o mediante server.ts (en producción/ng build), para levantar el SSR
export default bootstrap;
