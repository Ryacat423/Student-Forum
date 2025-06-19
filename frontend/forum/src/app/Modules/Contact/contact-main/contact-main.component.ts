import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../services/forum/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-main',
  imports: [BreadcrumbsComponent, ReactiveFormsModule],
  templateUrl: './contact-main.component.html',
  styleUrl: './contact-main.component.css'
})
export class ContactMainComponent implements OnInit {

  constructor(
    private dservice: DataService,
    private modal: NgbModal
  ){}

  user: any;
  navs = [
    { label: 'Home', link: '/forum/home' }
  ];

  current: string = 'Contact';

  message!: FormGroup;

  ngOnInit(): void {
    this.user = Number(localStorage.getItem('token'));
    this.initForm();
  }

  initForm(){
    this.message = new FormGroup({
      from: new FormControl(this.user ? this.user : 0),
      to: new FormControl(12),
      subject: new FormControl(''),
      email: new FormControl(''),
      content: new FormControl(''),
      reply_to: new FormControl(0)
    });
  }

  sendMessage() {
    console.log(this.message.value);
    this.dservice.sendMessage(this.message.value).subscribe((res: any) => {
      if(res === 1){
        this.showApprovalConfirmation();
        this.message.reset();
      }
    });
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
