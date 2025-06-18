import { Routes } from "@angular/router";
import { HomeMainComponent } from "./home-main/home-main.component";
import { CategoriesComponent } from "./categories/categories.component";
import { DiscussionMainComponent } from "./Discussions/discussion-main/discussion-main.component";

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
                path: 'discussions/:id',
                component: DiscussionMainComponent
            },
            {
                path: '',
                redirectTo: 'categories',
                pathMatch: 'full'
            }
        ]
    }
]