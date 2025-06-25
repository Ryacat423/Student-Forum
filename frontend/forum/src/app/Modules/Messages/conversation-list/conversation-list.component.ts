import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchFilterPipe } from '../../../Pipe/search/search-filter.pipe';
import { DataService } from '../../../services/forum/data.service';

@Component({
  selector: 'app-conversation-list',
  imports: [CommonModule, FormsModule, SearchFilterPipe],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.css'
})
export class ConversationListComponent implements OnInit{
  convo: any = [];
  userID: any;
  messages: any[] = []
  keyword=''

  constructor(
    private dservice: DataService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.userID = localStorage.getItem('u_token');
    this.dservice.getMessages().subscribe((res: any)=>{
      this.convo = res.messages;
      console.log(this.convo);
    })
  }

  navigateMessage(messageID: any){
    this.router.navigate(['/forum/messages/body', messageID])
  }
}
