import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('/admin');
    }
  }

  login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  loginAdmin() {
    this.auth.login(this.login.value).subscribe((res:any)=> {
      if (res.success === 1) {
        this.showSuccess();
        localStorage.setItem('token', res.access_token);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        this.showError();
      }
    });
  }

  showSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Logged in Succesfully!',
      showConfirmButton: true,
      timer: 3000,
    });
  }

  showError() {
    Swal.fire('Oops...', 'Something went wrong!', 'error');
  }
}
