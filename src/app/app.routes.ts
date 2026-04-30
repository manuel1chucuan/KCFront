import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { MenuComponent } from './menu/menu.component';
import { InicioComponent } from './inicio/inicio.component';

// rutas
export const routes: Routes = [
    { path: '', component:InicioComponent},
    { path:'login', redirectTo: '', pathMatch: 'full' },
                                            // redirecciona a inicio si no hay autenticación
    { path:'menu', component:MenuComponent, canActivate: [authGuard] },
    // cualquier ruta que no sea login o menu renderiza MenuComponent
    { path: '**', component: MenuComponent, canActivate: [authGuard] },
];
