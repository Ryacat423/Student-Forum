import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserActionsComponent } from '../user-actions/user-actions.component';
import { UserViewComponent } from '../user-view/user-view.component';
import { DataService } from '../../../../services/forum/data.service';

@Component({
  selector: 'app-user-main',
  imports: [UserActionsComponent, UserViewComponent],
  templateUrl: './user-main.component.html',
  styleUrl: './user-main.component.css'
})
export class UserMainComponent implements OnInit {
  users: any;
  userCount: any;
  selectedUser: any;
  showNoticeForm: boolean = false;

  @Output() sendUserCount = new EventEmitter();

  constructor(private dservice: DataService){}

  ngOnInit(): void {
    this.getReportedUsers();
  }

  getReportedUsers() {
    this.dservice.getUserReports().subscribe((res:any)=> {
      this.users = res;
    });
  }

  getUserCount(count: number) {
    this.userCount = count;
    this.sendUserCount.emit(this.userCount);
  }

  getSelectedUser(user: any) {
    this.selectedUser = user;
    this.showNoticeForm = !!user.showNotice;
  }
}
