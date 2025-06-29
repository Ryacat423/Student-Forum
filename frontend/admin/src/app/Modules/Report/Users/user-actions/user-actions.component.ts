import { Component, contentChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-actions',
  imports: [ReactiveFormsModule],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.css'
})
export class UserActionsComponent implements OnChanges {

  constructor(private router: Router) {}

  @Input() user: any;
  @Input() showNoticeForm: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  notice = new FormGroup({
    subject: new FormControl(''),
    content: new FormControl('')
  });

  viewReportedPost(postId: number) {
    this.router.navigate(['/admin/view/', postId]);
  }

}
