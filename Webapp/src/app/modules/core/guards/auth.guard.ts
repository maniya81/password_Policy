import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { StorageService, StorageKey } from '../services/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService ,private storageService: StorageService,) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    if (this.authService.isLoggedIn() )
      return true;
    else {
      alert('You have been logged out please log in again');
      this.router.navigate(['signin']);
      return false;
    }
  }
} 
