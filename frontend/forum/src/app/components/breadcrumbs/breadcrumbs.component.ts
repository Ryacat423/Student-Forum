import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../Pipe/time/time-ago.pipe';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule, CommonModule, TimeAgoPipe],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css'
})

export class BreadcrumbsComponent implements OnInit{
  @Input() navs!: { label: string, link: string }[];
  @Input() current!: string;  

  user: any = null;
  userData: any;

  convo: any[] = [];
  notifs: any[] = [];

  constructor(
    private router: Router, 
    private uservice: UserService
  ){}
  ngOnInit(): void {
    this.user = localStorage.getItem('token');
    if (this.user) {
      this.uservice.getUser(this.user).subscribe((res: any) => {
        this.userData = res;
        console.log(this.userData)
      });
      this.uservice.getConvoList(this.user).subscribe((res: any)=>{
        this.convo = res;
      });
      this.uservice.getNotifs(this.user).subscribe((res: any)=>{
        this.notifs = res;
      })
    }

    this.checkIfMobile()
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
    this.router.navigate(['./forum/register']);
    this.current = 'Register';
  }

  navigateLogin() {
    this.router.navigate(['./forum/login']);
    this.current = 'Login';
  }
}
