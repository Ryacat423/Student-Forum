// import { Injectable } from '@angular/core';
// import { Resolve, Router } from '@angular/router';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { AuthService } from './auth.service';

// @Injectable({ providedIn: 'root' })
// export class AuthResolver implements Resolve<any> {
//   constructor(private auth: AuthService, private router: Router) {}

//   resolve(): Observable<any> {
//     const id = localStorage.getItem('u_token');
//     const token = localStorage.getItem('token');

//     if (!id || !token) {
//       console.warn('[Resolver] No user token or ID found');
//       this.router.navigate(['/public/login']);
//       return of(null);
//     }

//     return this.auth.getUser(+id).pipe(
//       map(user => {
//         console.log('[Resolver] Fetched user:', user);
//         this.auth.setUser(user);  // Save in service
//         return user; // THIS IS WHAT GETS PASSED TO data['user']
//       }),
//       catchError(error => {
//         console.error('[Resolver] Error:', error);
//         this.router.navigate(['/public/login']);
//         return of(null);
//       })
//     );
//   }
// }
