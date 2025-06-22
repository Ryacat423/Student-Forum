import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../Pipe/time/time-ago.pipe';
import { UserService } from '../../services/user/user.service';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule, CommonModule, TimeAgoPipe],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css'
})

export class BreadcrumbsComponent implements OnInit{
  @Input() navs!: { label: string, link: string }[];
  @Input() current!: string;  

  userData: any;
  
  profile: any;

  convo: any[] = [];
  notifs: any[] = [];

  constructor(
    private router: Router, 
    private uservice: UserService
  ){}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userData = this.uservice.getLoggedUser();
      this.profile = environment.mediaUrl + this.userData.profile_pic;
    }
    this.checkIfMobile();
  }

  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  navigateRegister() {
    this.router.navigate(['/public/register']);
    this.current = 'Register';
  }

  navigateLogin() {
    this.router.navigate(['/public/login']);
    this.current = 'Login';
  }
}
