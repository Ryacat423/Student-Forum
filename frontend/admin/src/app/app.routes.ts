import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { home } from './Modules/Home/home.routes';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: MainComponent,
        children: [
            {
                path: 'home',
                loadChildren: () => import('./Modules/Home/home.routes').then(h=>home)
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
