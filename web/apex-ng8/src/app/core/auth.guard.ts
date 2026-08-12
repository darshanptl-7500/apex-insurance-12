import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    if (this.auth.isAuthenticated()) {
      const requiredRole = route.data && route.data.role;
      if (requiredRole && !this.auth.hasRole(requiredRole)) {
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
