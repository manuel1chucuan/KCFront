import { Injectable } from '@angular/core';
// un Observable es una fuente de datos que emite valores a lo largo del tiempo
// y a la que puedes suscribirte para reaccionar cuando esos valores cambian.
// BehaviorSubject es un Observable que permite empujarle
import { BehaviorSubject, Observable } from 'rxjs';

// con @Injectable, Angular instancia la clase e inyecta sus dependencias al ser necesitada por primera vez
@Injectable({
  providedIn: 'root' // existe una sola instancia del servicio en toda la aplicación
})

// servicio para las funcionalidades de la barra de búsqueda
export class FiltroPrincipal {
  // la corriente cambiante de los inputs en la barra de búqueda. 
  // Guarda un string, siempre tiene valor actual (empieza vacío "")
  // y puede emitir nuevos valores
  private filteredDataSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  // el input de la barra de búsqueda que se expone. Se expone el último valor en la corriente
  filteredData$: Observable<string> = this.filteredDataSubject.asObservable();

  // actualiza el criterio de búsqueda y notifica a todos los componentes suscritos
  setFilteredData(data: string): void {
    // emite un nuevo valor a la corriente de inputs
    this.filteredDataSubject.next(data);
  }

  // método para obtener el input actual de la barra de búsqueda
  getFilteredData(): Observable<string> {
    return this.filteredData$;
  }
}
