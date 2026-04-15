import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { MenuComponent } from './menu/menu.component';
import { InicioComponent } from './inicio/inicio.component';

// rutas
// la app cuenta con solo dos componentes
export const routes: Routes = [
    { path: '', component:InicioComponent},
    { path:'login', component:LoginComponent },
                                            // redirecciona a inicio si no hay autenticación
    { path:'menu', component:MenuComponent, canActivate: [authGuard] },
    // cualquier ruta que no sea login o menu renderiza MenuComponent
    { path: '**', component: MenuComponent, canActivate: [authGuard] },
];