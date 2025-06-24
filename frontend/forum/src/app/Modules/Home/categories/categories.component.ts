import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { SearchFilterPipe } from '../../../Pipe/search/search-filter.pipe';
import { DataService } from '../../../services/forum/data.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-categories',
  imports: [BreadcrumbsComponent, SearchFilterPipe, FormsModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  constructor(private dservice: DataService, private router: Router, private auth: AuthService) {}

  isLoading: boolean = true;
  categories: any;

  current: string = 'Categories';
  imgurl: string = environment.mediaUrl;

  keyword: any;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.dservice.getCategories().subscribe((res: any) => {
      this.categories = res;
      this.isLoading = false;
    });
  }

  select(categ: any) {
    const path = this.auth.isLoggedIn() ? '/forum/home/discussions/' : '/public/home/discussions/';
    this.router.navigate([path, categ]);
  }
}
