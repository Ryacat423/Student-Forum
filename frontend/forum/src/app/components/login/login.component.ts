import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [BreadcrumbsComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  navs = [
    { label: 'Home', link: '/forum/home' }
  ];
  current: string = 'Login';

  errmsg: string = '';
  login = new FormGroup({
    user: new FormControl(null),
    password: new FormControl(null),
  });

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('/forum/home');
    }
  }

  loginUser() {
    this.auth.login(this.login.value).subscribe((result: any) => {
      console.log(result);
      if (result.userdata != null) {
        localStorage.setItem('token', result.userdata.userID); 
        this.showApprovalConfirmation();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        this.errmsg = result.msg;
        this.showError();
        this.login.reset();
      }
    });
  }

  showApprovalConfirmation() {
    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'Welcome back!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  showError() {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: this.errmsg || 'Invalid username or password',
      confirmButtonText: 'Try Again',
      position: 'center'
    });
  }
}
