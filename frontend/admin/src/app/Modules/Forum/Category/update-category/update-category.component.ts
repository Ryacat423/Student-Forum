import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../services/forum/data.service';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-update-category',
  imports: [ReactiveFormsModule],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css'
})
export class UpdateCategoryComponent implements OnChanges {
  @Input() category: any;
  @Output() saveUpdate = new EventEmitter<any>();
  
  selectedFile: File | null = null;
  uploadProgress = 0;
  
  img:any;

  editForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    id: new FormControl('')
  });
  
  constructor(private dservice: DataService, private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && changes['category'].currentValue) {
      this.editForm.controls['name'].setValue(changes['category'].currentValue.name || '');
      this.editForm.controls['description'].setValue(changes['category'].currentValue.description || '');
      this.editForm.controls['id'].setValue(changes['category'].currentValue.category_id || '');

      this.selectedFile = changes['category'].currentValue.icon;
      this.img = "http://127.0.0.1:8000/media/" + this.selectedFile;
    }
  }
  
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('File selected:', this.selectedFile);
    }
  }
  
  editCateg(): void {
    const fd = new FormData();
    fd.append('category_data', JSON.stringify({
      name: this.editForm.value.name,
      description: this.editForm.value.description,
      id: this.editForm.value.id || (this.category ? this.category.category_id : 0)
    }));
    if (this.selectedFile !== null) {
      fd.append('icon', this.selectedFile);
    }
    
    this.http.post(`${environment.apiUrl}edit_category`, fd, {
      observe: 'events',
      reportProgress: true
    }).subscribe((event: any) => {
        if (event.body && event.body.categories) {
          this.saveUpdate.emit(event.body.categories);
          this.resetForm();
        }
    });
  }
  
  resetForm(): void {
    this.editForm.reset();
    this.category = null;
    this.selectedFile = null;
    this.uploadProgress = 0;
  }
}