import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$: Observable<any> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

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
