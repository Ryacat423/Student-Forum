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
    return this.http.get(`${environment.apiUrl}get_categories.php`)
  }

  getTopics(id: number){
    return this.http.get(`${environment.apiUrl}get_topics.php?id=${id}`)
  }

  sendMessage(data: any){
    return this.http.post(`${environment.apiUrl}send_message.php`, JSON.stringify(data));
  }
}
