import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentFormComponent } from '../comment-form/comment-form.component';

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
  @Input() status: any; // User status (muted, etc.)

  // Output events to parent component
  @Output() replyLike = new EventEmitter<any>();
  @Output() replyUpdate = new EventEmitter<any>();
  @Output() replyDelete = new EventEmitter<any>();
  @Output() newReplyAdded = new EventEmitter<any>();

  editingCommentId: number | null = null;
  editReplyText = '';
  
  // Reply form management
  activeReplyForms: {[key: string]: boolean} = {};
  replyingTo: {[key: string]: any} = {};
  showChildReplies: boolean = false;

  ngOnInit() {
    console.log(this.replies)
    
    // Initialize status if not passed from parent
    if (!this.status) {
      this.status = localStorage.getItem('status');
    }
  }

  getUserLikeStatus(likes: any[], currentUserId: number): number | null {
    const like = likes?.find(like => like.user_id === currentUserId);
    return like ? like.status : null;
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

      // Emit the update event to parent
      this.replyUpdate.emit({
        action: 'edit',
        replyId: replyId,
        content: this.editReplyText,
        commentId: this.commentId
      });

      // Reset editing state
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
      
      // Close all other reply forms
      Object.keys(this.activeReplyForms).forEach(existingKey => {
        if (existingKey !== key) {
          this.activeReplyForms[existingKey] = false;
        }
      });
      
      // Toggle current reply form
      this.activeReplyForms[key] = !this.activeReplyForms[key];
  
      // Set replying-to information for nested replies
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

  toggleReplyLike(replyId: number) {
    const reply = this.replies.find((r: any) => r.postID === replyId);
    console.log(reply);
    
    if (!reply) return;
  
    const action = reply.like_status == 1 ? 'unlike' : 'like';
  
    const likeData = {
      action,
      userID: this.currentUserId,
      replyId: replyId,
      commentId: this.commentId
    };
  
    // Emit like event to parent
    this.replyLike.emit(likeData);
  }
  
  deleteReply(replyId: number) {
    // Emit delete event to parent
    this.replyDelete.emit({
      replyId: replyId,
      commentId: this.commentId
    });
  }
  
  onReplyAdded(data: any) {
    console.log('Reply added:', data);
    
    // Add commentId to the reply data
    const replyData = {
      ...data,
      commentId: this.commentId
    };
    
    // Emit new reply event to parent
    this.newReplyAdded.emit(replyData);

    // Reset reply forms
    this.activeReplyForms = {};
    this.replyingTo = {};
  }
}