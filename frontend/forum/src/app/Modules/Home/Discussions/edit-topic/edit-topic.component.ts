import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core'; 
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { BreadcrumbsComponent } from '../../../../components/breadcrumbs/breadcrumbs.component';
import { DataService } from '../../../../services/forum/data.service';
import { environment } from '../../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-topic',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BreadcrumbsComponent],
  templateUrl: './edit-topic.component.html',
  styleUrl: './edit-topic.component.css',
})
export class EditTopicComponent implements OnInit {
  
  current: string = 'Home';
  
  currrentuser: any = '';
  isSubmitting = false;
  
  navs: any = [];

  post: any;
  selectedFiles: File[] = [];
  topicID: any;
  currentAttachment: string | null = null;
  
  topicForm!: FormGroup;
  
  constructor(
    private dservice: DataService, 
    private acroute: ActivatedRoute, 
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.currrentuser = localStorage.getItem('u_token');
    this.acroute.paramMap.subscribe((res: any) => {
      this.topicID = res.get('postId');
      this.loadPostData();
    });
  }
  
  loadPostData(): void {
    this.dservice
      .getPost(this.topicID)
      .subscribe((res: any) => {
        console.log(res);
        this.post = res;
        this.current = 'Editing';
        this.navs.push(
          { 
            label: 'Categories', 
            link: this.currrentuser ? '/forum/home/categories' : '/public/home/categories' 
          },
          {
            label: this.post.topic.title,
            link: `/forum/home/discussions/${this.post.topic.category_id}/post/${this.post.topic.topic_id}`
          }
        );
        
        this.topicForm = new FormGroup({
          title: new FormControl(this.post.topic.title),
          content: new FormControl(this.post.post.content),
          keepAttachment: new FormControl(true)
        });
        
        this.currentAttachment = this.post.filename || null;
      });
  }
  
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }
  
  removeAttachment(): void {
    this.currentAttachment = null;
    this.topicForm.patchValue({ keepAttachment: false });
    console.log('Attachment removed, keepAttachment set to:', this.topicForm.value.keepAttachment);
  }
  
  cancelEdit(): void {
    this.router.navigate([`/forum/home/discussions/${this.post.topic.category_id}/post/${this.post.topic.topic_id}`]);
  }
  
  savePost(): void {
    this.isSubmitting = true;

    const formData = new FormData();
    
    formData.append('_method', 'PUT');
    formData.append('title', this.topicForm.value.title || '');
    formData.append('content', this.topicForm.value.content || '');

    if (this.selectedFiles) {
      this.selectedFiles.forEach(file => {
        formData.append('images[]', file);
      });
    }

    this.http.post(`${environment.apiUrl}update/${this.topicID}`, formData, {
      observe: 'events',
      reportProgress: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe((res: any) => {
      if (!res) {
        this.showError();
      }

      setTimeout(()=> {
        this.router.navigateByUrl(
          `/forum/home/discussions/${this.post.topic.category_id}/post/${this.post.topic.topic_id}`
        );

      }, 1000);
    });
  }

  showSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Edit Successful',
      showConfirmButton: false,
    });
  }

  showError() {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong',
      text: 'Inputs required',
      showConfirmButton: false,
      timer: 1000,
    });
  }
}