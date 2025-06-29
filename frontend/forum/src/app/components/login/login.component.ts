import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [BreadcrumbsComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  current: string = 'Login';

  errmsg: string = '';
  login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  
  loginUser() {
    this.auth.login(this.login.value).subscribe({
      next: (res: any) => {
        if (res.success === 1) {
          this.showSuccess();
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('u_token', res.user);
          localStorage.setItem('status', res.status)
          this.router.navigateByUrl('/forum/home');
        }
      },
      error: (err: any) => {
        if (err.status === 403 || err.status === 422) {
          if (err.error?.email || err.error?.password) {
            this.showError(`Validation Error: ${Object.values(err.error).flat().join('\n')}`);
          } else if (err.error?.error) {
            this.showError(err.error.error); 
          } else {
            this.showError("Access Denied: Invalid login.");
          }
        } else {
          this.showError("An unexpected error occurred.");
        }
        console.error(err);
      }
    });
  }

  showSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'Welcome back!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  showError(message: any) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      html: Array.isArray(message) ? message.join('<br>') : message, 
      confirmButtonText: 'Try Again',
      position: 'center',
      timer: 3000
    });
  }
}
