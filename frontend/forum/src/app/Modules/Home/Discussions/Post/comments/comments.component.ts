import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DataService } from '../../../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { environment } from '../../../../../../environments/environment.prod';
import { RepliesComponent } from '../replies/replies.component';

@Component({
  selector: 'app-comments',
  imports: [CommentFormComponent, CommonModule, FormsModule, RepliesComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() postId!: number;
  @Input() user_id!: number;
  @Input() commentCount!: number;
  @Input() isToggled: boolean = false;

  @Input() comments: any;

  @Input() repliesVisibility: { [commentId: number]: boolean } = {};
  @Output() newCommentAdded = new EventEmitter<any>();
  @Output() commentUpdate = new EventEmitter<any>();
  @Output() likeComment = new EventEmitter<any>();
  @Output() likeReply = new EventEmitter<any>();

  @Output() delComment = new EventEmitter<any>();

  constructor(private dservice: DataService) {}
  mediaurl: string = environment.mediaUrl;

  sortOption = 'newest';
  currentUserId: any;

  editingCommentId: number | null = null;
  editText = '';
  editReplyText = '';

  showicon: boolean = true;
  status: any;

  activeReplyForms: { [key: string]: boolean } = {};
  likedComments: { [key: number]: boolean } = {};
  replyingTo: any = {};

  ngOnInit() {
    this.currentUserId = Number(localStorage.getItem('u_token')) || 0;
    this.status = localStorage.getItem('status');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['comments'] && this.comments) {
      this.sortComments();
    }
  }

  sortComments() {
    switch (this.sortOption) {
      case 'newest':
        this.comments.sort(
          (a: any, b: any) =>
            new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
        );
        break;
      case 'oldest':
        this.comments.sort(
          (a: any, b: any) =>
            new Date(a.post_date).getTime() - new Date(b.post_date).getTime()
        );
        break;
      case 'likes':
        this.comments.sort((a: any, b: any) => b.totalLikes - a.totalLikes);
        break;
    }
  }

  getUserLikeStatus(likes: any[], currentUserId: number): number | null {
    const like = likes?.find((like) => like.user_id === currentUserId);
    return like ? like.status : null;
  }

  onCommentAdded(comment: any) {
    console.log('Comment added:', comment);
    this.newCommentAdded.emit(comment);
    this.isToggled = !this.isToggled;
  }

  toggleReplies(commentId: number) {
    this.repliesVisibility[commentId] = !this.repliesVisibility[commentId];
    this.showicon = !this.showicon;
  }

  shouldShowReplies(commentId: number): boolean {
    return !!this.repliesVisibility[commentId];
  }

  toggleLike(commentId: number) {
    const comment = this.comments.find((c: any) => c.postID === commentId);
    console.log(comment);
    if (!comment) return;

    const action = comment.like_status == 1 ? 'unlike' : 'like';

    const likeData = {
      action,
      userID: this.currentUserId,
      commentId,
    };

    this.likeComment.emit(likeData);
  }

  toggleEdit(commentId: number, content: string) {
    if (this.editingCommentId === commentId) {
      this.editingCommentId = null;
      this.editText = '';
    } else {
      this.editingCommentId = commentId;
      this.editText = content;
    }
  }

  saveEdit(commentId: number) {
    if (this.editText.trim()) {
      const commentData = {
        id: commentId,
        content: this.editText,
        topic_id: this.postId,
      };

      // this.dservice.updateReply(commentData).subscribe((res: any) => {
      //   if (res.msg == 1) {
      //     this.editingCommentId = null;
      //     this.editText = '';

      //     this.commentUpdate.emit({
      //       action: 'edit',
      //       commentId: commentId,
      //       content: this.editText
      //     });
      //   }
      // });
    }
  }

  deleteComment(commentId: number) {
    this.delComment.emit(commentId);
    console.log(commentId);
  }

  getReplyFormKey(commentId: number, replyId?: number): string {
    return replyId
      ? `comment_${commentId}_reply_${replyId}`
      : `comment_${commentId}`;
  }

  toggleReplyForm(commentId: number, replyId?: number, replyName?: string) {
    if (this.status != 'muted') {
      const key = this.getReplyFormKey(commentId, replyId);
      Object.keys(this.activeReplyForms).forEach((existingKey) => {
        if (existingKey !== key) {
          this.activeReplyForms[existingKey] = false;
        }
      });

      this.activeReplyForms[key] = !this.activeReplyForms[key];

      if (this.activeReplyForms[key] && replyId) {
        this.replyingTo[key] = {
          id: replyId,
          name: replyName || 'Unknown',
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
  // Add these methods to your CommentsComponent class

  // Handle reply like events
  onReplyLike(likeData: any) {
    console.log('Reply like event:', likeData);
    this.likeReply.emit(likeData);
  }

  // Handle reply update events
  onReplyUpdate(updateData: any) {
    console.log('Reply update event:', updateData);

    // Find and update the reply in the local data structure
    const comment = this.comments.find(
      (c: any) => c.post_id === updateData.commentId
    );
    if (comment && comment.replies) {
      const reply = comment.replies.find(
        (r: any) => r.postID === updateData.replyId
      );
      if (reply) {
        reply.content = updateData.content;
      }
    }

    // Emit to parent component if needed
    this.commentUpdate.emit({
      action: 'reply_edit',
      ...updateData,
    });
  }

  // Handle reply delete events
  onReplyDelete(deleteData: any) {
    console.log('Reply delete event:', deleteData);

    // Remove reply from local data structure
    const comment = this.comments.find(
      (c: any) => c.post_id === deleteData.commentId
    );
    if (comment && comment.replies) {
      comment.replies = comment.replies.filter(
        (r: any) => r.postID !== deleteData.replyId
      );
    }

    // Emit to parent component
    this.delComment.emit(deleteData.replyId);
  }

  // Handle new reply added events
  onNewReplyAdded(replyData: any) {
    console.log('New reply added:', replyData);

    // Add reply to local data structure
    const comment = this.comments.find(
      (c: any) => c.post_id === replyData.commentId
    );
    if (comment) {
      if (!comment.replies) {
        comment.replies = [];
      }
      comment.replies.push(replyData);
    }

    // Emit to parent component
    this.newCommentAdded.emit(replyData);
  }
}
