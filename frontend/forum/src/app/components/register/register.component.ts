import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-register',
  imports: [BreadcrumbsComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  navs = [
    { label: 'Home', link: '/forum/home' }
  ];
  current: string = 'Register';

  ngOnInit(): void {
    
  }
}
