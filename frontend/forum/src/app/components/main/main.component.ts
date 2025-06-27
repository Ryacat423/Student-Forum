import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { TimeAgoPipe } from '../../Pipe/time/time-ago.pipe';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-main',
  imports: [RouterModule, CommonModule, TimeAgoPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {


  constructor(
    private uservice: UserService,
    private auth: AuthService,
    private acroute: ActivatedRoute,
    private router: Router
  ) {}

  userId: any;
  userData: any;
  isLoadingUser: boolean = false;

  convo: any[] = [];
  notifs: any[] = [];

  current: string = '';

  mobileMenuOpen: boolean = false;
  isMobile: boolean = false;
  isMedium: boolean = false;

  saved: any;
  isDark: boolean = false;
  status: any;

  ngOnInit(): void {
    this.userId = localStorage.getItem('u_token');
    this.saved = localStorage.getItem('isDark');
    this.status = localStorage.getItem('status');
  
    this.isDark = this.saved === 'true';

    if (this.userId) {
      this.loadUserData();
      this.uservice.getNotifications();
    }

    this.checkIfMobile();
  }

  private loadUserData(): void {
    this.userData = this.acroute.snapshot.data['user'];
    if (this.userData) {
      this.uservice.setUser(this.userData);
      this.uservice.refreshUser();
      return;
    }

    this.isLoadingUser = true;
    this.uservice.getUser(Number(this.userId)).subscribe({
      next: (user: any) => {
        this.userData = user;
        this.uservice.setUser(user);
        this.isLoadingUser = false;
        console.log('User data loaded:', this.userData);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoadingUser = false;
        this.logout();
      },
    });
  }

  navigateHome() {
    this.router.navigate([this.userData ? '/forum/home' : '/public/home']);
    this.current = 'Home';
    this.closeMobileMenu();
  }

  navigateAbout() {
    this.router.navigate([
      this.userData ? '/forum/about-us' : '/public/about-us',
    ]);
    this.current = 'About Us';
    this.closeMobileMenu();
  }

  navigateContact() {
    this.router.navigate([
      this.userData ? '/forum/contact' : '/public/contact',
    ]);
    this.current = 'Contact Us';
    this.closeMobileMenu();
  }

  navigateRegister() {
    this.router.navigate(['/public/register']);
    this.current = 'Register';
    this.closeMobileMenu();
  }

  navigateProfile() {
    this.router.navigate(['/forum/profile']);
    this.current = 'Profile';
    this.closeMobileMenu();
  }
  navigateMessages() {
    this.router.navigate(['/forum/home/messages']);
    this.current = 'Messages';
    this.closeMobileMenu();
  }

  navigateLogin() {
    this.router.navigate(['/public/login']);
    this.current = 'Login';
    this.closeMobileMenu();
  }

  logout() {
    localStorage.clear();
    this.uservice.clearUser();
    this.closeMobileMenu();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
    this.isMedium = window.innerWidth > 768 && window.innerWidth < 992;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    localStorage.setItem('isDark', this.isDark.toString());
  }

  log() {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Close',
      reverseButtons: true,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }
}
