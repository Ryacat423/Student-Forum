import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryMainComponent } from '../Category/category-main/category-main.component';
import { SharedDataService } from '../../../services/shared/shared-data.service';
import { DataService } from '../../../services/forum/data.service';

@Component({
  selector: 'app-forum-main',
  imports: [RouterModule],
  templateUrl: './forum-main.component.html',
  styleUrl: './forum-main.component.css'
})
export class ForumMainComponent implements OnInit {
  constructor(private sharedData: SharedDataService, private dservice: DataService) {}
  totalCategories: any = 0;
  totalMembers: any = 0;

  ngOnInit(): void {
    this.sharedData.currentCategoryCount.subscribe(count => {
      this.totalCategories = count;
    });

    this.dservice.getDashboardStats().subscribe((res: any)=> {
      this.totalMembers = res.students;
    })
  }

}
