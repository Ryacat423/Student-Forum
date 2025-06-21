import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getApplicants() {
    return this.http.get(`${environment.apiUrl}applicants`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getCategories() {
    return this.http.get(`${environment.apiUrl}get_categories`);
  }

  addCategory(data: any) {
    return this.http.post(`${environment.apiUrl}edit_category`, data);
  }


}
