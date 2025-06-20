import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-category',
  imports: [],
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css'
})
export class ViewCategoryComponent {
  @Input() categories: any;
  @Output() selectCategory = new EventEmitter();
  
  select(categ: any){
    this.selectCategory.emit(categ)
  }
  
}
