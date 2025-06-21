import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: any = null;

  constructor(private http: HttpClient) { }

  setUser(data: any) {
    this.user = data;
  }

  getUser() {
    return this.user;
  }

  clearUser() {
    this.user = null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  registerUser(data: any){
    return this.http.post(`${environment.apiUrl}register`, data);
  }

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
}
