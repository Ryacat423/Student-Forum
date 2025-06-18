import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(id: number){
    return this.http.get(`${environment.apiUrl}get_user.php?id=${id}`);
  }

  getConvoList(userId: number){
    return this.http.get(`${environment.apiUrl}get_conversation.php?userID=${userId}`);
  }

  getNotifs(userId:any){
    return this.http.get(`${environment.apiUrl}get_notifs.php?userID=${userId}`);
  }
}
