import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${environment.apiUrl}login`, data);
  }

  logout() {
    return this.http.post(`${environment.apiUrl}logout`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  approveApplicant(userId: number) {
    return this.http.post(`${environment.apiUrl}applicants/approve`, {user_id: userId}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
