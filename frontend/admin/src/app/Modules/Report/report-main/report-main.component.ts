import { Component } from '@angular/core';
import { UserMainComponent } from '../Users/user-main/user-main.component';
import { PostMainComponent } from '../Posts/post-main/post-main.component';

@Component({
  selector: 'app-report-main',
  imports: [UserMainComponent, PostMainComponent],
  templateUrl: './report-main.component.html',
  styleUrl: './report-main.component.css'
})
export class ReportMainComponent {
  active: string = 'users';
  reportUserCount: number = 0;
  reportPostCount: number = 0;

  switchActive(active: string) {
    this.active = active;
  }

  getUserCount(count: number) {
    this.reportUserCount = count;
  }
  
  getPostCount(count: number) {
    this.reportPostCount = count;
  }
}
