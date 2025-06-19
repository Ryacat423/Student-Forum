import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/forum/data.service';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-new-topic',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-topic.component.html',
  styleUrl: './new-topic.component.css'
})
export class NewTopicComponent {

  @Input() categid!: number;
  @Output() saveTopic = new EventEmitter();
  
  userid = localStorage.getItem('token');
  
  constructor(
    private dservice: DataService, 
    private http: HttpClient
  ){}

  topicForm = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    categid: new FormControl(),
    userid: new FormControl(),
  });

  selectedFile: any = null;

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile);
    }
  }

  addTopic() {
    this.topicForm.controls['userid'].setValue(Number(this.userid));
    this.topicForm.controls['categid'].setValue(Number(this.categid));
  
    const fd = new FormData();
    if (this.selectedFile) {
      fd.append('files', this.selectedFile);
    }
    fd.append('topic_data', JSON.stringify(this.topicForm.value));
  
    this.http.post(`${environment.apiUrl}create_topic.php`,fd, {
      observe: 'events',
      reportProgress: true
    })
      .subscribe((res: any) => {
        console.log(res);
        this.topicForm.reset();
        this.saveTopic.emit(res);
      });
  }
}
