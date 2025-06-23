import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getCourses(){
    return this.http.get(`${environment.apiUrl}get_courses`);
  }

  getCategories() {
    return this.http.get(`${environment.apiUrl}get_categories`);
  }

  getCategoryById(id: number) {
    return this.http.get(`${environment.apiUrl}category/${id}`);
  }

  getTopics(id: number, filter: string){
    return this.http.get(`${environment.apiUrl}topics/category/${id}?filter=${filter}`);
  }

  getPost(id: number) {
    return this.http.get(`${environment.apiUrl}posts/${id}`);
  }

  sendMessage(data: any){
    return this.http.post(`${environment.apiUrl}send_message.php`, JSON.stringify(data));
  }
}
