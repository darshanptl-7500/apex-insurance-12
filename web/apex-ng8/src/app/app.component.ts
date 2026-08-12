import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/auth.service';
import { ApexUser } from './core/models';

@Component({
  selector: 'apex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Apex Insurance';
  currentPath = '';

  constructor(public auth: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {
    // Hybrid handoff: the AngularJS shell owns login. Unauthenticated visits
    // to an ng8 island bounce to the classic shell, which then returns with
    // ?token=... (see AuthService.hydrateFromQueryString).
    // Explicit /login remains available for standalone ng8 development only.
    if (!this.auth.isAuthenticated() && !this.isLoginRoute()) {
      this.auth.redirectToShellLogin();
    }
  }

  isLoginRoute(): boolean {
    return window.location.pathname.indexOf('/login') === 0;
  }

  get user(): ApexUser {
    return this.auth.currentUser();
  }

  get authenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.auth.hasRole('Admin');
  }

  isManager(): boolean {
    return this.auth.hasRole('UnderwritingManager', 'Admin');
  }

  isActive(path: string): boolean {
    return this.currentPath.indexOf(path) === 0;
  }

  logout(): void {
    this.auth.logout();
  }

  shellUrl(hashPath: string): string {
    return this.auth.shellUrl(hashPath);
  }
}
