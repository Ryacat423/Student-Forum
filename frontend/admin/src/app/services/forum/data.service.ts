import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get(`${environment.apiUrl}members`);
  }

  getDashboardStats() {
    return this.http.get(`${environment.apiUrl}dashboard-stats`);
  }

  getApplicants(page = 1, perPage = 5) {
    return this.http.get(`${environment.apiUrl}applicants?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getUserReports() {
    return this.http.get(`${environment.apiUrl}reports`, {
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
