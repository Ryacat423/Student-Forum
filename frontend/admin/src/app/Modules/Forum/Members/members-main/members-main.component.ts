import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../../../../Pipe/search/search-filter.pipe';
import { DataService } from '../../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-members-main',
  imports: [FormsModule, SearchFilterPipe, CommonModule],
  templateUrl: './members-main.component.html',
  styleUrl: './members-main.component.css'
})
export class MembersMainComponent implements OnInit{
  keyword: any;
  members: any;

  constructor(
    private dservice: DataService,
    private auth: AuthService
  ){}

  ngOnInit(): void {
    this.dservice.getMembers().subscribe((res: any)=> {
      this.members = res;
      console.log(this.members);
    })
  }

  mute(userId: number) {
    this.auth.muteUser(userId).subscribe((res: any)=> {
      if(res.success) {
        this.members = res.users;
      }
    })
  }

  suspend(userId: number) {
    this.auth.suspendUser(userId).subscribe((res: any)=>{
      if(res.success) {
        this.members = res.users;
      }
    })
  }
}
