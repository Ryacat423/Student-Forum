import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../environments/environment.prod';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-post-data',
  imports: [CommonModule, CommentsComponent],
  templateUrl: './post-data.component.html',
  styleUrl: './post-data.component.css',
})
export class PostDataComponent implements OnInit {
  @Input() postData: any = [];
  @Input() isAuthor: any;
  @Input() liked: boolean = false;
  @Input() likeCount: number = 0;
  @Input() currentUser: number = 0;

  @Input() reportTypes: any;

  @Output() reportPost = new EventEmitter<any>();
  @Output() likePost = new EventEmitter();

  comments: any;
  showComment: boolean = false;
  mediaurl: string = environment.mediaUrl;

  constructor(
    private modal: NgbModal,
    private router: Router,
    private dservice: DataService
  ) {}

  ngOnInit(): void {
    const postId: any = this.postData.topic.topic_id
    this.getComments(postId);
  }

  getComments(postId: number) {
    this.dservice.getComments(postId).subscribe((res: any)=> {
      this.comments = res;
      console.log(this.comments);
    })
  }

  toggleLike() {
    if (!this.currentUser) {
      this.notifyLoginRequired();
      return;
    }

    const action = this.liked ? 'unlike' : 'like';
    const likeData = {
      action: action,
      userID: this.currentUser,
      postID: this.postData.topic.topic_id,
    };
    this.liked = !this.liked;
    this.likePost.emit(likeData);
  }

  toggleComment() {
    if (!this.currentUser) {
      this.notifyLoginRequired();
      return;
    }
    this.showComment = !this.showComment;
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
