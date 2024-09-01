import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
    { path:'login', component:LoginComponent },
    { path:'menu', component:MenuComponent, canActivate: [authGuard] },
    { path: '**', component: MenuComponent, canActivate: [authGuard] },
];