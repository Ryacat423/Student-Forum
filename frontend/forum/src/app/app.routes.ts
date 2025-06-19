import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { home } from './Modules/Home/home.routes';
import { profile } from './Modules/Profile/profile.routes';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { about } from './Modules/About/about.routes';
import { ContactMainComponent } from './Modules/Contact/contact-main/contact-main.component';

export const routes: Routes = [
    {
        path: 'forum',
        component: MainComponent,
        children: [
            {
                path: 'home',
                loadChildren: ()=>import('./Modules/Home/home.routes').then(h=>home)
            },
            {
                path: 'profile',
                loadChildren: ()=>import('./Modules/Profile/profile.routes').then(p=>profile)
            },
            {
                path: 'about-us',
                loadChildren: ()=>import('./Modules/About/about.routes').then(a=>about)
            },
            {
                path: 'contact',
                component: ContactMainComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'login',
                component: LoginComponent
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
        redirectTo: 'forum',
        pathMatch: 'full'
    }
];
