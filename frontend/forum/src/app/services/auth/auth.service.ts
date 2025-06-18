import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerUser(userData: any){
    return this.http.post(`${environment.apiUrl}register.php`, JSON.stringify(userData));
  }

  login(data: any){
    return this.http.post(`${environment.apiUrl}login.php`, JSON.stringify(data))
  }
}
