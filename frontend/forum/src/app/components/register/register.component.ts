import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [BreadcrumbsComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  navs = [
    { label: 'Home', link: '/forum/home' }
  ];
  current: string = 'Register';

  register = new FormGroup({
    
  })

  ngOnInit(): void {
    
  }
}
