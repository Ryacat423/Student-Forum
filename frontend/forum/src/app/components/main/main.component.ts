import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { TimeAgoPipe } from '../../Pipe/time/time-ago.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  imports: [RouterModule, CommonModule, TimeAgoPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  constructor(
    private uservice: UserService, 
    private router: Router
  ) {}

  userId: any;
  userData: any;

  convo: any[] = [];
  notifs: any[] = [];

  current: string = '';

  mobileMenuOpen: boolean = false;
  isMobile: boolean = false;
  
  saved: any;
  isDark: boolean = true;

  ngOnInit(): void {
    this.userId = localStorage.getItem('token');
    this.saved = localStorage.getItem('isDark');

    this.isDark = this.saved === 'true';

    if (this.userId) {
      this.getUserData(this.userId);
      this.getConvos(this.userId);
      this.getNotifications(this.userId);
    }

    this.checkIfMobile();
  }

  getUserData(userId: number) {
    this.uservice.getUser(userId).subscribe((res: any) => {
      this.userData = res;
      localStorage.setItem('status', this.userData.status);
    });
  }

  getConvos(userId: number) {
    this.uservice.getConvoList(userId).subscribe((res: any) => {
      this.convo = res;
    });
  }

  getNotifications(userId: number) {
    this.uservice.getNotifs(userId).subscribe((res: any) => {
      this.notifs = res;
    });
  }
  navigateHome() {
    this.router.navigate(['./forum/home']);
    this.current = 'Home';
    this.closeMobileMenu();
  }

  navigateAbout() {
    this.router.navigate(['./forum/about-us']);
    this.current = 'About Us';
    this.closeMobileMenu();
  }

  navigateContact() {
    this.router.navigate(['./forum/contact']);
    this.current = 'Contact Us';
    this.closeMobileMenu();
  }

  navigateRegister() {
    this.router.navigate(['./forum/register']);
    this.current = 'Register';
    this.closeMobileMenu();
  }

  navigateProfile() {
    this.router.navigate(['./forum/profile']);
    this.current = 'Profile';
    this.closeMobileMenu();
  }
  navigateMessages() {
    this.router.navigate(['./forum/home/messages']);
    this.current = 'Messages';
    this.closeMobileMenu();
  }

  navigateLogin() {
    this.router.navigate(['./forum/login']);
    this.current = 'Login';
    this.closeMobileMenu();
  }

  logout() {
    localStorage.clear();
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

  log(){
    Swal.fire({
      title: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Close',
      reverseButtons: true
    }).then((result: any)=>{
      if(result.isConfirmed){
        this.logout();
      }
    });
  }
}
