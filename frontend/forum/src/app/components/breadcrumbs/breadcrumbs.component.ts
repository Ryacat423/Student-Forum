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
export class BreadcrumbsComponent implements OnInit {
  @Input() navs!: { label: string, link: string }[];
  @Input() current!: string;  

  userData: any;
  userId: any;
  profile: any;
  isLoadingUser: boolean = false;

  convo: any[] = [];
  notifs: any;

  saved: any;
  isDark: boolean = false;

  constructor(
    private router: Router, 
    private uservice: UserService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.userId = localStorage.getItem('u_token');
    this.saved = localStorage.getItem('isDark');
    this.isDark = this.saved === 'true';

    if (token && this.userId) {
      this.loadUserData();
      this.uservice.notifs$.subscribe((notif)=> {
        if (notif?.notified) {
          this.notifs = notif;
        }
      })

    }
    this.checkIfMobile();
  }

  private loadUserData(): void {
    this.userData = this.uservice.getLoggedUser();
    
    if (this.userData) {
      this.loadUserRelatedData();
      return;
    }

    this.isLoadingUser = true;
    this.uservice.getUser(Number(this.userId)).subscribe({
      next: (user: any) => {
        this.userData = user;
        this.uservice.setUser(user); 
        this.isLoadingUser = false;
        this.loadUserRelatedData();
      },
      error: (error) => {
        console.error('Error loading user data in breadcrumbs:', error);
        this.isLoadingUser = false;
      }
    });
  }

  private loadUserRelatedData(): void {
    if (this.userData) {
      // Load conversations and notifications if needed
      // this.getConvos(this.userId);
      // this.getNotifications(this.userId);
    }
  }
  toggleDarkMode() {
    this.isDark = !this.isDark;
    localStorage.setItem('isDark', this.isDark.toString());
  }
  // Uncomment these methods when ready to use
  // getConvos(userId: number) {
  //   this.uservice.getConvoList(userId).subscribe((res: any) => {
  //     this.convo = res;
  //   });
  // }

  // getNotifications(userId: number) {
  //   this.uservice.getNotifs(userId).subscribe((res: any) => {
  //     this.notifs = res;
  //   });
  // }

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