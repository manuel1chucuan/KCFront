import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltroPrincipal {
  private filteredDataSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  filteredData$: Observable<string> = this.filteredDataSubject.asObservable();

  setFilteredData(data: string): void {
    this.filteredDataSubject.next(data);
  }

  getFilteredData(): Observable<string> {
    return this.filteredData$;
  }
}
