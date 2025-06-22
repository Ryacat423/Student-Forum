import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  userid = localStorage.getItem('u_token');
  selectedFiles: File[] = [];

  topicForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl('')
  });

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  addTopic() {
    const formData = new FormData();

    this.selectedFiles.forEach(file => {
      formData.append('images[]', file);
    });

    formData.append('category_id', String(this.categid));
    formData.append('user_id', String(this.userid));
    formData.append('title', this.topicForm.value.title || '');
    formData.append('content', this.topicForm.value.content || '');

    this.http.post(`${environment.apiUrl}topics`, formData, {
      observe: 'events',
      reportProgress: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe((res: any) => {
      console.log(res);
      this.topicForm.reset();
      this.selectedFiles = [];
      this.saveTopic.emit(res);
    });
  }
}
