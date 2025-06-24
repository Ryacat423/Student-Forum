import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../services/forum/data.service';

@Component({
  selector: 'app-conversation',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css',
  standalone: true
})
export class ConversationComponent {
  message: any;
  replies: any[] = [];

  senderID: number = 0;
  receiverID: number = 0;
  messageID: any;

  isReplying: boolean = false;

  constructor(private dservice: DataService, private acroute: ActivatedRoute, private modal: NgbModal) {}

  reply!: FormGroup;

  ngOnInit(): void {
    this.receiverID = Number(localStorage.getItem('token'));
    this.acroute.paramMap.subscribe((res) => {
      this.messageID = res.get('id');
      this.getMessages();
    });
  }

  toggleReply() {
    this.isReplying = !this.isReplying;
  }
  
  initForm() {
    this.reply = new FormGroup({
      from: new FormControl(this.receiverID),
      to: new FormControl(this.senderID),
      subject: new FormControl(null),
      content: new FormControl(null),
      reply_to: new FormControl(this.message.messageID)
    });
  }
  
  sendMessage() {
    console.log(this.reply.value);
    // this.dservice.sendMessage(this.reply.value).subscribe((res: any) => {
    //   if(res === 1){
    //     this.showApprovalConfirmation();
    //     this.reply.reset();
    //     this.getMessages();
    //     this.isReplying = !this.isReplying;
    //   }
    // });
  }

  getMessages() {
    // this.dservice.getMessages(this.messageID).subscribe((res: any) => {
    //   console.log(res);
    //   this.message = res.message;
    //   this.replies = res.replies;
    //   this.senderID = Number(this.message.sender_id);
    //   this.initForm();
    // });
  }

  @ViewChild('messageModal') messageModal: any;
  showApprovalConfirmation() {
    this.modal.open(this.messageModal, {
      centered: true,
      keyboard: false,
      backdrop: false
    });
  }
}