import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { UserService } from '../../../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment.prod';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-main',
  imports: [BreadcrumbsComponent, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.css'
})
export class ProfileMainComponent implements OnInit {
  current = 'My Profile';
  isEditing = false;
  profileForm!: FormGroup;
  profileData: any;
  courses: any[] = [];
  selectedFile: File | null = null;
  userActivities: any;
  allActivities: any;
  activityFilter = 'all';

  mediaUrl = environment.mediaUrl;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadCourses();
    this.loadActivities();
  }

  loadProfile(): void {
    this.profileData = this.userService.getLoggedUser();

    this.profileForm = this.fb.group({
      username: [this.profileData.username],
      email: [this.profileData.email],
      first_name: [this.profileData.first_name],
      middle_name: [this.profileData.middle_name],
      last_name: [this.profileData.last_name],
      birthday: [this.profileData.bdate],
      course_id: [this.profileData.course?.course_id],
      bio: [this.profileData.bio]
    });
  }

  loadCourses(): void {
    this.http.get(`${environment.apiUrl}get_courses`).subscribe((res: any) => {
      this.courses = res;
    });
  }

  loadActivities(): void {
    this.userService.getActivities().subscribe((res:any)=> {
      this.allActivities = res.activities;
      this.userActivities = [...this.allActivities];
    })
  }

  toggleEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadProfile();
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  updateProfileImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('profile_img', this.selectedFile);

    this.http.post(`${environment.apiUrl}profile/image`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: () => {
        this.showSuccess('Profile photo updated');
        this.loadProfile();
        this.selectedFile = null;
      },
      error: () => this.showError('Failed to update profile photo')
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.userService.updateProfile(this.profileForm.value).subscribe((res:any)=> {
      if(res.success){
        this.isEditing = false;
        this.profileData = res.user;
        window.location.reload();
      }
    });
  }

  filterActivities(filter: string): void {
    this.activityFilter = filter;

    if (filter === 'posts') {
      this.userActivities = this.allActivities.filter((activity:any) => activity.reply === null);
    } else if (filter === 'comments') {
      this.userActivities = this.allActivities.filter((activity:any) => activity.reply !== null);
    } else {
      this.userActivities = [...this.allActivities];
    }

  }

  deletePost(topicId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This post and all related media will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}topic/${topicId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).subscribe({
          next: () => {
            this.showSuccess('Post deleted');
            this.loadActivities();
          },
          error: () => this.showError('Failed to delete post')
        });
      }
    });
  }

  showSuccess(msg: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: msg,
      timer: 1500,
      showConfirmButton: false
    });
  }

  showError(msg: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg
    });
  }
}
