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
  selectedFile: any = null;

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile)
    }
  }

  submitComment() {
    if (!this.commentText.trim() && !this.selectedFile) return;
    this.isSubmitting = true;
        
    const commentData = {
      topic_id: this.postId,
      user_id: this.userId,
      content: this.commentText,
      reply: this.parentId ?? 0,
      reply_to_reply: this.replyToId
    };
    
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('files', this.selectedFile);
      fd.append('comment_data', JSON.stringify(commentData));
      
      // this.dservice.commentWithAttachment(fd).subscribe((res: any) => {
      //   console.log(res);
      //   if (res.msg === 1) {
      //     this.commentAdded.emit(res);
      //     this.commentText = '';
      //     this.selectedFile = null;
      //   }
      //   this.isSubmitting = false;
      // });
    } else {
      // this.dservice.commentOnPost(commentData).subscribe((res: any) => {
      //   console.log(res);
      //   if (res.msg === 1) {
      //     this.commentAdded.emit(res);
      //     this.commentText = '';
      //   }
      //   this.isSubmitting = false;
      // });
    }
  }
}
