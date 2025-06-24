import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { environment } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-replies',
  imports: [CommonModule, FormsModule, CommentFormComponent],
  templateUrl: './replies.component.html',
  styleUrl: './replies.component.css'
})
export class RepliesComponent implements OnInit {
  @Input() replies: any;
  @Input() commentId: any;
  @Input() currentUserId: any;
  @Input() status: any;

  @Output() replyUpdate = new EventEmitter<any>();
  @Output() replyDelete = new EventEmitter<any>();
  @Output() newReplyAdded = new EventEmitter<any>();

  editingCommentId: number | null = null;
  editReplyText = '';
  mediaurl: string = environment.mediaUrl;

  showicon: boolean = false;
  
  activeReplyForms: {[key: string]: boolean} = {};
  replyingTo: {[key: string]: any} = {};
  showChildReplies: boolean = false;

  ngOnInit() {
    console.log(this.replies)
    if (!this.status) {
      this.status = localStorage.getItem('status');
    }
  }

  toggleReplyEdit(replyId: number, content: string) {
    if (this.editingCommentId === replyId) {
      this.editingCommentId = null;
      this.editReplyText = '';
    } else {
      this.editingCommentId = replyId;
      this.editReplyText = content;
    }
  }
  
  saveReplyEdit(replyId: number) {
    if (this.editReplyText.trim()) {
      const replyData = {
        id: replyId,
        content: this.editReplyText,
        commentId: this.commentId
      };

      this.replyUpdate.emit({
        action: 'edit',
        replyId: replyId,
        content: this.editReplyText,
        commentId: this.commentId
      });

      this.editingCommentId = null;
      this.editReplyText = '';
    }
  }

  getReplyFormKey(commentId: number, replyId?: number): string {
    return replyId ? `comment_${commentId}_reply_${replyId}` : `comment_${commentId}`;
  }
  
  toggleReplyForm(commentId: number, replyId?: number, replyName?: string) {
    if (this.status !== 'muted') {
      const key = this.getReplyFormKey(commentId, replyId);
      
      Object.keys(this.activeReplyForms).forEach(existingKey => {
        if (existingKey !== key) {
          this.activeReplyForms[existingKey] = false;
        }
      });

      this.activeReplyForms[key] = !this.activeReplyForms[key];

      if (this.activeReplyForms[key] && replyId) {
        this.replyingTo[key] = {
          id: replyId,
          name: replyName || 'Unknown'
        };
      } else if (!this.activeReplyForms[key]) {
        delete this.replyingTo[key];
      }
    }
  }
  
  showReplyForm(commentId: number, replyId?: number): boolean {
    const key = this.getReplyFormKey(commentId, replyId);
    return !!this.activeReplyForms[key];
  }
  
  getReplyingTo(commentId: number, replyId?: number): any {
    const key = this.getReplyFormKey(commentId, replyId);
    return this.replyingTo[key] || null;
  }
  
  deleteReply(replyId: number) {
    this.replyDelete.emit({
      replyId: replyId,
      commentId: this.commentId
    });
  }
  
  onReplyAdded(data: any) {
    console.log('Reply added:', data);
    const activeFormKey = Object.keys(this.activeReplyForms).find(key => this.activeReplyForms[key]);
    if (activeFormKey) {
      this.activeReplyForms[activeFormKey] = false;
      delete this.replyingTo[activeFormKey];
    }
    this.newReplyAdded.emit(data);
  }

  toggleReplies(commentId: number) {
    this.showicon = !this.showicon;
  }
}