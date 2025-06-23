import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-post-data',
  imports: [CommonModule],
  templateUrl: './post-data.component.html',
  styleUrl: './post-data.component.css',
})
export class PostDataComponent {
  @Input() postData: any;
  @Input() isAuthor: any;
  @Input() liked: boolean = false;
  @Input() currentUser: number = 0;

  @Input() reportTypes: any;

  @Output() reportPost = new EventEmitter<any>();
  @Output() likePost = new EventEmitter();

  showComment: boolean = false;
  mediaurl: string = environment.mediaUrl;

  constructor(
    private acroute: ActivatedRoute,
    private modal: NgbModal,
    private router: Router,
    private dataService: DataService
  ) {}

  toggleLike() {
    if (!this.currentUser) {
      this.notifyLoginRequired();
      return;
    }

    const action = this.liked ? 'unlike' : 'like';
    const likeData = {
      action: action,
      userID: this.currentUser,
      postID: this.postData.postID,
    };
    this.liked = !this.liked;
    this.likePost.emit(likeData);
  }

  capitalizeFirstLetter(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getInitials(): string {
    const fullName = this.postData.post.user.first_name + '' +  this.postData.post.user.last_name;
    const parts = fullName.trim().split(' ');
    const firstInitial = parts[0]?.charAt(0) ?? '';
    const secondInitial = parts[1]?.charAt(0) ?? '';
    return firstInitial + secondInitial;
  }

  toggleComment() {
    if (!this.currentUser) {
      this.notifyLoginRequired();
      return;
    }
    this.showComment = !this.showComment;
  }

  notifyLoginRequired() {
    Swal.fire('Login Required', 'You need to login to perform this action', 'info');
  }

  editTopic(postid: number) {
    this.router.navigate(['/forum/home/edit-topic', postid]);
  }

  postIdToReport: number | null = null;
  @ViewChild('report') reportTemplate!: TemplateRef<any>;

  openReportModal(postId: number): void {
    if (!this.currentUser) {
      this.notifyLoginRequired();
      return;
    }

    this.postIdToReport = postId;
    this.modal.open(this.reportTemplate, {
      size: 'md',
      ariaLabelledBy: 'modal-title',
      keyboard: false,
      centered: true,
      windowClass: 'modal-holder',
      backdrop: 'static',
      backdropClass: 'custom-backdrop',
    });
  }
}
