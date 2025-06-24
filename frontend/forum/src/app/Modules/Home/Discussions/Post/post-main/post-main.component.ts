import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../../components/breadcrumbs/breadcrumbs.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../services/forum/data.service';
import { PostDataComponent } from '../post-data/post-data.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-main',
  imports: [BreadcrumbsComponent, PostDataComponent, CommonModule],
  templateUrl: './post-main.component.html',
  styleUrl: './post-main.component.css'
})
export class PostMainComponent implements OnInit {
  constructor(
    private dservice: DataService, 
    private acroute: ActivatedRoute, 
    private modal: NgbModal
  ){}
  
  current: string = 'Home';
  postId: number | null = null;
  postData: any;
  
  loading: boolean = false;
  error: string | null = null;

  isAuthor: boolean = false;
  currentUser: any = '';
  
  liked: boolean = false;
  likeCount: number = 0;
  
  navs = [
    { label: 'Categories', link: this.currentUser ? '/forum/home' : '/public/home' }
  ];
  
  ngOnInit(): void {
    this.currentUser = localStorage.getItem('u_token');
    this.acroute.paramMap
      .subscribe(params => {
        const id = params.get('postId');
        if (id) {
          this.postId = parseInt(id, 10);
          this.getPostData(this.postId);
        }
      });
  }

  getPostData(postId: number) {
    if (!postId || postId <= 0) {
      this.error = 'Invalid post ID';
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.dservice.getPost(postId).subscribe((res: any) => {
      this.postData = res;
      console.log(this.postData)
      this.isAuthor = this.postData.post.user.user_id == localStorage.getItem('u_token');
      this.loading = false;
      this.current = this.postData?.topic.title;
      this.likeCount = this.postData.like_count;
      const userLike = this.postData?.post.likes
        .find((like: any) => like.user_id == this.currentUser);
      
      this.liked = userLike?.status === 1;
    });
  }

  handleLike(likeData: any) {
    console.log(likeData);
    this.dservice.like(likeData).subscribe((res: any)=> {
      this.postData.post = res.post;
      const userLike = this.postData?.post.likes
        .find((like: any) => like.user_id == this.currentUser);
      this.liked = userLike?.status === 1;
      this.likeCount = res.like_count;
    })
  }

  handleReport(data: any) {
    Swal.fire({
      title: 'Confirm Report',
      text: 'Are you sure you want to report this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit Report',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dservice.reportPost(data).subscribe({
          next: (res: any) => {
            if (res.success) {
              Swal.fire('Reported!', res.message, 'success');
            } else {
              Swal.fire('Error', 'Failed to submit report.', 'error');
            }
          },
          error: (err) => {
            let errorMsg = 'An error occurred.';
            if (err.status === 422 && err.error?.errors) {
              const errors = err.error.errors;
              errorMsg = Object.values(errors).flat().join('\n');
            } else if (err.error?.message) {
              errorMsg = err.error.message;
            }
            
            Swal.fire('Validation Error', errorMsg, 'error');

          }
        });
      }
    });
  }
}