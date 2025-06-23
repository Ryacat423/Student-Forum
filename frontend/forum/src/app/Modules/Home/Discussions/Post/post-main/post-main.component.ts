import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../../components/breadcrumbs/breadcrumbs.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../services/forum/data.service';
import { PostDataComponent } from '../post-data/post-data.component';
import { CommonModule } from '@angular/common';

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
  
  navs = [
    { label: 'Categories', link: '/forum/home' },
  ];

  current: string = 'Home';
  postId: number | null = null;
  postData: any;
  loading: boolean = false;
  error: string | null = null;

  isAuthor: boolean = false;
  currentUser: any;

  liked: boolean = false;

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

  getPostData(postId: number): void {
    if (!postId || postId <= 0) {
      this.error = 'Invalid post ID';
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.dservice.getPost(postId).subscribe((res: any) => {
      this.postData = res;
      this.isAuthor = this.postData.post.user.user_id == localStorage.getItem('u_token');
      this.loading = false;
      console.log('Post data loaded:', this.postData);
    });
  }
}