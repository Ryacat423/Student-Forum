import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryMainComponent } from '../Category/category-main/category-main.component';
import { SharedDataService } from '../../../services/shared/shared-data.service';

@Component({
  selector: 'app-forum-main',
  imports: [RouterModule],
  templateUrl: './forum-main.component.html',
  styleUrl: './forum-main.component.css'
})
export class ForumMainComponent implements OnInit {
  constructor(private sharedData: SharedDataService) {}
  totalCategories: any;

  ngOnInit(): void {
    this.sharedData.currentCategoryCount.subscribe(count => {
      this.totalCategories = count;
    });
  }

}
