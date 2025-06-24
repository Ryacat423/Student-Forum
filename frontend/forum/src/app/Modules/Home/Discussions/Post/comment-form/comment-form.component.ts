import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../services/forum/data.service';

@Component({
  selector: 'app-comment-form',
  imports: [FormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
  standalone: true
})
export class CommentFormComponent {
  @Input() postId!: number;
  @Input() parentId?: number;
  @Input() userId?: number;
  @Input() replyToId?: number;
  @Output() commentAdded = new EventEmitter<any>();
  
  constructor(private dservice: DataService){}
    
  commentText = '';
  isSubmitting = false;

  selectedFiles: File[] = [];
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  submitComment() {
    if (!this.commentText.trim() && this.selectedFiles.length === 0) return;

    this.isSubmitting = true;
    const formData = new FormData();

    formData.append('topic_id', String(this.postId));
    formData.append('user_id', String(this.userId ?? ''));
    formData.append('content', this.commentText);
    formData.append('reply', String(this.parentId ?? 0));

    this.selectedFiles.forEach(file => {
      formData.append('images[]', file);
    });

    this.dservice.comment(formData).subscribe((res:any)=>{
      if (res.success) {
          this.commentAdded.emit(res.comments);
          this.commentText = '';
          this.selectedFiles = [];
        }
        this.isSubmitting = false;
    });
  }
}
