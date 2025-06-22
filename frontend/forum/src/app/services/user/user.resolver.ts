// user.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
  constructor(private uservice: UserService) {}

  resolve(): Observable<any> {
    const id = localStorage.getItem('u_token');
    return this.uservice.getUser(Number(id)).pipe(
      tap(user => this.uservice.setUser(user))
    );
  }
}
