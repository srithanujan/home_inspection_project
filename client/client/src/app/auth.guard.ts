// auth.guard.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, ) {
  }


  canActivate(): boolean {
    const isLoggedIn = !!localStorage?.getItem('authToken');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // canActivate(): boolean {
  //   try {
  //     const isLoggedIn = !!localStorage.getItem('authToken');
  //     if (!isLoggedIn) {
  //       this.router.navigate(['/login']);
  //       return false;
  //     }
  //     return true;
  //   } catch (error) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }

}

