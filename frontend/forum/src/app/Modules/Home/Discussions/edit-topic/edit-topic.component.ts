import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core'; 
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { BreadcrumbsComponent } from '../../../../components/breadcrumbs/breadcrumbs.component';
import { DataService } from '../../../../services/forum/data.service';
import { environment } from '../../../../../environments/environment.prod';
import { HttpClient, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

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
  currentAttachment: any;
  removeCurrentImages = false;
  mediaUrl = environment.mediaUrl;
  
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
          content: new FormControl(this.post.post.content)
        });
        
        this.currentAttachment = this.post.post.media;
        
      });
  }
  
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
      console.log('Selected files:', this.selectedFiles);
    }
  }
  
  removeAttachment(): void {
    this.currentAttachment = [];
    this.selectedFiles = [];
    this.removeCurrentImages = true;
    console.log('Attachment will be removed on save');
  }
  
  removeNewFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
  
  cancelEdit(): void {
    this.router.navigate([`/forum/home/discussions/${this.post.topic.category_id}/post/${this.post.topic.topic_id}`]);
  }
  
  savePost(): void {
    if (this.topicForm.invalid) {
      this.showError();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    
    formData.append('_method', 'PUT');
    formData.append('title', this.topicForm.value.title || '');
    formData.append('content', this.topicForm.value.content || '');

    if (this.removeCurrentImages) {
      formData.append('remove_current_images', '1');
    }

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file, index) => {
        formData.append('images[]', file, file.name);
      });
    }

    console.log('Submitting form data:', {
      title: this.topicForm.value.title,
      content: this.topicForm.value.content,
      removeCurrentImages: this.removeCurrentImages,
      selectedFiles: this.selectedFiles.length
    });

    this.http.post(`${environment.apiUrl}update/${this.topicID}`, formData, {
      observe: 'response',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Update response:', response);
        this.isSubmitting = false;
        
        if (response.body && response.body.success) {
          this.showSuccess();
          setTimeout(() => {
            this.router.navigateByUrl(
              `/forum/home/discussions/${this.post.topic.category_id}/post/${this.post.topic.topic_id}`
            );
          }, 1500);
        } else {
          this.showError();
        }
      },
      error: (error) => {
        console.error('Update error:', error);
        this.isSubmitting = false;
        this.showError();
      }
    });
  }

  showSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Post Updated Successfully',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  showError() {
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: 'Please check your inputs and try again',
      showConfirmButton: false,
      timer: 2000,
    });
  }
}