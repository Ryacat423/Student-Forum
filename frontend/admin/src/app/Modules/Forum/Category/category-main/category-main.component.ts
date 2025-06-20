import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/forum/data.service';
import { ViewCategoryComponent } from '../view-category/view-category.component';
import { SharedDataService } from '../../../../services/shared/shared-data.service';
import { UpdateCategoryComponent } from '../update-category/update-category.component';

@Component({
  selector: 'app-category-main',
  imports: [ViewCategoryComponent, UpdateCategoryComponent],
  templateUrl: './category-main.component.html',
  styleUrl: './category-main.component.css'
})
export class CategoryMainComponent implements OnInit {

  constructor(
    private dservice: DataService,
    private sharedData: SharedDataService
  ){}
  
  categories: any;
  selected: any;
  totalCategories: number = 0;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.dservice.getCategories().subscribe((res: any)=>{
      this.categories = res.categories;
      this.totalCategories = res.total;
      this.sharedData.updateCategoryCount(this.totalCategories);

      const currentValue = this.sharedData.getCategoryCountValue();
      console.log('Current shared category count:', currentValue);
    });
  }

  getSelected(category:any) {
    this.selected = category;
    console.log(this.selected)
  }

  refreshCateg(categories: any) {
    this.categories = categories;
  }
}
