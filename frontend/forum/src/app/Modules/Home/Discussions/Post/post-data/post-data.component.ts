import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../environments/environment.prod';
import { CommentsComponent } from '../comments/comments.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-data',
  imports: [CommonModule, CommentsComponent, FormsModule],
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

  postId: any;
  types: any;

  constructor(
    private modal: NgbModal,
    private router: Router,
    private dservice: DataService
  ) {}

  ngOnInit(): void {
    this.postId = this.postData.topic.topic_id
    this.getComments(this.postId);
    this.getReportTypes();
  }

  getReportTypes() {
    this.dservice.getReportTypes().subscribe((res:any)=>{
      this.types = res;
      console.log(this.types)
    })
  }

  getComments(postId: number) {
    this.dservice.getComments(postId).subscribe((res: any)=> {
      this.comments = res;
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
      topicID: this.postData.topic.topic_id,
      postID: this.postData.post.post_id
    };
    this.liked = !this.liked;
    console.log(likeData);
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

  handleLike(likeData: any) {
    console.log('Comment like data:', likeData);
    this.dservice.like(likeData).subscribe((res: any) => {
      console.log('Like response:', res);

      if (this.comments && Array.isArray(this.comments)) {
        const commentIndex = this.comments.findIndex((comment: any) => comment.post_id === likeData.postID);
        
        if (commentIndex !== -1) {
          this.comments[commentIndex].likes = res.post.likes;
          this.comments[commentIndex].like_count = res.like_count;
        }
      }
    });
  }

  deleteComment(commentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This comment and all associated replies will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dservice.deleteComment(commentId).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.comments = this.getComments(this.postId);
              Swal.fire('Deleted!', 'Comment has been deleted.', 'success');
            } else {
              Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
          },
          error: () => {
            Swal.fire('Error!', 'Could not delete the comment.', 'error');
          }
        });
      }
    });
  }

  postIdToReport: number | null = null;
  selectedReportTypes: number[] = [];
  explanation: string = '';
  maxCharacterCount: number = 500;
  error: string = '';

  toggleReportType(typeId: number): void {
    if (this.isSelected(typeId)) {
      this.selectedReportTypes = this.selectedReportTypes.filter(
        (id) => id !== typeId
      );
    } else {
      this.selectedReportTypes.push(typeId);
    }
  }

  isSelected(typeId: number): boolean {
    return this.selectedReportTypes.includes(typeId);
  }

  resetForm(): void {
    this.selectedReportTypes = [];
    this.explanation = '';
    this.error = '';
  }

    handleReportSubmission(): void {
    if (!this.currentUser) {
      this.notifyLoginRequired();
      return;
    }

    if (!this.postIdToReport) {
      console.error('No post ID to report');
      return;
    }

    if (this.selectedReportTypes.length === 0) {
      this.error = 'Please select at least one report type';
      return;
    }

    if (this.explanation.trim().length < 10) {
      this.error = 'Please provide a more detailed explanation';
      return;
    }

    const completeReportData = {
      types: this.selectedReportTypes,
      post_id: this.postIdToReport,
      explanation: this.explanation,
      userid: Number(this.currentUser),
    };
    console.log(completeReportData)
    this.reportPost.emit(completeReportData);

    this.modal.dismissAll();
    this.resetForm();
  }
  @ViewChild('report') reportTemplate!: TemplateRef<any>;
  openReportModal(postId: number): void {
    if (!this.currentUser) {
      this.notifyLoginRequired();
      return;
    }

    this.postIdToReport = postId;
    this.modal.open(this.reportTemplate, {
      size: 'lg',
      ariaLabelledBy: 'modal-title',
      centered: true,
      windowClass: 'modal-holder',
      backdrop: 'static',
      backdropClass: 'custom-backdrop',
    });
  }
}
