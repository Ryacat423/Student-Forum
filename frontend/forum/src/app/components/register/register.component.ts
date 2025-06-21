import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [BreadcrumbsComponent, ReactiveFormsModule, RouterModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  constructor(
    private dservice: DataService,
    private auth: AuthService
  ){}

  navs = [
    { label: 'Home', link: '/forum/home' }
  ];
  genderOptions: string[] = ['Male', 'Female', 'Others'];

  courses: any;
  majors: any;
  selectedCourse: any;

  current: string = 'Register';

  register = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    middle_name: new FormControl(null),   
    bdate: new FormControl(null),
    gender: new FormControl(''),
    
    course_id: new FormControl(0),
    major_id: new FormControl(0),

    email: new FormControl(''),
    contact: new FormControl(''),

    barangay: new FormControl(''),
    town: new FormControl(''),
    city: new FormControl(''),

    username: new FormControl(''),
    password: new FormControl(''),

    bio: new FormControl('my bio'),
    status: new FormControl('pending'),
    role: new FormControl('student'),
    profile_pic: new FormControl('default.png'),
    password_confirmation: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    this.getCourses();
  } 

  sendForm() {

    const formData = { ...this.register.value } as any;

    if (formData.course_id == 7) {
      if (!formData.major_id) {
        console.error('Major is required for BSED course');
        return;
      }
      formData.course_id = formData.major_id;
    }

    formData.address = `${formData.barangay}, ${formData.town}, ${formData.city}`;
    formData.course_id = parseInt(formData.course_id, 10);

    delete formData.barangay;
    delete formData.town;
    delete formData.city;
    delete formData.major_id;

    console.log(formData);
    this.auth.registerUser(formData).subscribe((res: any) => {
      if (res.success === 1) {
        this.showSuccess();
        this.register.reset();
      } else {
        this.showError();
      }
    });
  }

  getCourses() {
    this.dservice.getCourses().subscribe((res: any)=> {
    this.majors = res.filter((course: any) => course.parent_id !== null);
    this.courses = res.filter((course: any) => course.parent_id === null);

    console.log('Courses:', this.courses);
    console.log('Majors:', this.majors);
    })
  }
  
  showSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Registration Sent',
      text: 'Please wait for Admin Confirmation!',
      showConfirmButton: true,
      timer: 3000,
    });
  }

  showError() {
    Swal.fire('Oops...', 'Something went wrong!', 'error');
  }

  getFieldControl(field: string): FormControl {
    return this.register.get(field) as FormControl;
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirm = control.get('password_confirmation');
    return password && confirm && password.value !== confirm.value
      ? { passwordMismatch: true }
      : null;
  }

  isInvalid(field: string): boolean {
    const control = this.getFieldControl(field);
    return control.invalid && (control.dirty || control.touched);
  }
}
