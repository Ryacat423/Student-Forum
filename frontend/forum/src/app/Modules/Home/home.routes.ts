import { Routes } from "@angular/router";
import { HomeMainComponent } from "./home-main/home-main.component";
import { CategoriesComponent } from "./categories/categories.component";

export const home: Routes = [
    {
        path: '',
        component: HomeMainComponent,
        children: [
            {
                path: 'categories',
                component: CategoriesComponent
            },
            {
                path: '',
                redirectTo: 'categories',
                pathMatch: 'full'
            }
        ]
    }
]