import {} from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// componente raíz de la app
@Component({
  // nombre de la etiqueta HTML que representa el componente (usada en index.html)
  selector: 'app-root',
  // el componente es autosuficiente (no pertenece a ningún módulo) y puede importar lo que necesite.
  // todos los componentes en esta app son standalone
  standalone: true,
  // importa el tag <router-outlet> en el componente
  imports: [RouterOutlet],
  // html del componente
  templateUrl: './app.component.html',
  // css del componente
  styleUrl: './app.component.scss'
})
// se exporta el componente
export class AppComponent {
  // CLEANUP: propiedad de la clase innecesaria, nunca se usa
  title = 'KCFront';
}
