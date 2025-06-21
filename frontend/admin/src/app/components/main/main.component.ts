import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  imports: [RouterModule, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  saved: any;
  
  mobileMenuOpen: boolean = false;
  isMobile: boolean = false;

  ngOnInit(): void {
    this.checkIfMobile();
  }
  
  logingOut(){
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

  logout() {
    this.auth.logout().subscribe((res: any)=> {
      if(res.success == 1) {
        localStorage.clear();
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    })
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
}
