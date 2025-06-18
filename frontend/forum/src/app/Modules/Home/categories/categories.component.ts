import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { SearchFilterPipe } from '../../../Pipe/search/search-filter.pipe';
import { DataService } from '../../../services/forum/data.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [BreadcrumbsComponent, SearchFilterPipe, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  constructor(
    private dservice: DataService,
    private router: Router
  ){}

  categories: any;

  navs = [
    { label: 'Home', link: '/forum/home' }
  ];
  current: string = 'Categories';
  imgurl: string = 'http://localhost/studentforum/admin/media/';

  keyword: any;

  ngOnInit(): void {
    this.getCategories();
  }

    getCategories(){
    this.dservice.getCategories().subscribe((res: any)=>{
      this.categories = res;
      console.log(this.categories)
    })
  }
  
  select(categ: any){
    this.router.navigate(['/forum/home/discussions', categ])
  }
}
