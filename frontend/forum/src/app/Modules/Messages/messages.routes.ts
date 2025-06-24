import { Routes } from "@angular/router";
import { MessagesComponent } from "./messages/messages.component";
import { ConversationComponent } from "./conversation/conversation.component";
import { ConversationListComponent } from "./conversation-list/conversation-list.component";

export const messages: Routes = [
    {
        path: '',
        component: MessagesComponent,
        children: [
            { path: 'inbox', component: ConversationListComponent },
            { path: 'body/:id', component: ConversationComponent },
            { path: '', redirectTo: 'inbox', pathMatch: 'full'}
        ]
    }
]