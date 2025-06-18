import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-categories',
  imports: [BreadcrumbsComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  navs = [
    { label: 'Home', link: '/forum/home' }
  ];
  current: string = 'Categories';
}
