import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  private notification = new BehaviorSubject<any>(null);
  
  user$: Observable<any> = this.userSubject.asObservable();
  notifs$: Observable<any> = this.notification.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  loadUser(): void {
    const id = localStorage.getItem('u_token');
    if (id) {
      this.getUser(+id).subscribe(user => {
        this.setUser(user);
      });
    }
  }

  getUser(userId: number) {
    return this.http.get(`${environment.apiUrl}user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  refreshUser() {
    const id = localStorage.getItem('u_token');
    if (id) {
      this.getUser(+id).subscribe((user:any) => {
        const oldStatus = localStorage.getItem('status');
        const newStatus = user.status;

        if (newStatus !== oldStatus) {
          localStorage.setItem('status', newStatus);

          if (newStatus === 'suspended') {
            Swal.fire({
              icon: 'warning',
              title: 'Account Suspended',
              text: 'You have been suspended. Contact Admin to gain Access again.',
              confirmButtonText: 'OK',
            }).then(()=>{
              localStorage.clear();
              this.router.navigate(['/'])
            });
          } else if (newStatus === 'muted') {
            Swal.fire({
              icon: 'info',
              title: 'You’ve been muted',
              text: 'You cannot comment or reply.',
              confirmButtonText: 'Got it'
            });
          } else if (oldStatus === 'muted' || oldStatus === 'suspended') {

            Swal.fire({
              icon: 'success',
              title: 'Restrictions Lifted',
              text: 'Your account has been restored.',
              confirmButtonText: 'Awesome'
            });
          }
        }

        this.setUser(user);
      });
    }
  }

  updateProfile(data: any) {
    return this.http.put(`${environment.apiUrl}profile/update`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  profilePicture(data: any) {
    return this.http.post(`${environment.apiUrl}/profile/image`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getActivities() {
    return this.http.get(`${environment.apiUrl}user/activities`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getNotifications() {
    if (this.notification.value !== null) return;

    this.http.get(`${environment.apiUrl}notif`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe((notif: any) => {
      this.notification.next(notif);
    });
  }

  setUser(data: any) {
    this.userSubject.next(data);
  }

  getLoggedUser(): any {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
  }
}
