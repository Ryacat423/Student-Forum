import { Routes } from "@angular/router";
import { ForumMainComponent } from "./forum-main/forum-main.component";
import { CategoryMainComponent } from "./Category/category-main/category-main.component";
import { MembersMainComponent } from "./Members/members-main/members-main.component";

export const forum: Routes = [
    {
        path: '',
        component: ForumMainComponent,
        children: [
            {
                path: 'category',
                component: CategoryMainComponent
            },
            {
                path: 'members',
                component: MembersMainComponent
            },
            {
                path: '',
                redirectTo: 'category',
                pathMatch: 'full'
            }
        ]
    }
]