import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { home } from './Modules/Home/home.routes';
import { forum } from './Modules/Forum/forum.routes';
import { AuthGuard } from './services/auth/auth.guard';
import { report } from './Modules/Report/report.routes';
import { PostViewComponent } from './Modules/Report/Posts/post-view/post-view.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'home',
                loadChildren: ()=>import('./Modules/Home/home.routes').then(h=>home)
            },
            {
                path: 'forum',
                loadChildren: ()=>import('./Modules/Forum/forum.routes').then(f=>forum)
            },
            {
                path: 'report',
                loadChildren: ()=>import('./Modules/Report/report.routes').then(r=>report)
            },
            {
                path: 'view/:id',
                component: PostViewComponent
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
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
