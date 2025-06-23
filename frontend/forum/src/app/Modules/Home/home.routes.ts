import { Routes } from "@angular/router";
import { HomeMainComponent } from "./home-main/home-main.component";
import { CategoriesComponent } from "./categories/categories.component";
import { DiscussionMainComponent } from "./Discussions/discussion-main/discussion-main.component";
import { PostMainComponent } from "./Discussions/Post/post-main/post-main.component";
import { EditTopicComponent } from "./Discussions/edit-topic/edit-topic.component";

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
                path: 'discussions/:categoryId/post/:postId',
                component: PostMainComponent
            },
            {
                path: 'edit-topic/:postId',
                component: EditTopicComponent
            },
            {
                path: '',
                redirectTo: 'categories',
                pathMatch: 'full'
            }
        ]
    }
]