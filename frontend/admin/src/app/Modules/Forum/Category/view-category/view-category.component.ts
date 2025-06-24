import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilterPipe } from '../../../../Pipe/search/search-filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-category',
  imports: [SearchFilterPipe, FormsModule],
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css'
})
export class ViewCategoryComponent {
  @Input() categories: any;
  @Output() selectCategory = new EventEmitter();
  
  keyword: any;
  select(categ: any){
    this.selectCategory.emit(categ)
  }
  
}
