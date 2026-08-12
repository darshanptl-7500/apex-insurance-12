import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApexUser } from './models';

const TOKEN_KEY = 'apex_token';
const USER_KEY = 'apex_user';

interface LoginApiUser {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  role: string | number;
  teamId?: number;
  teamName?: string;
  isActive: boolean;
}

interface LoginApiResponse {
  success: boolean;
  errorMessage?: string;
  token?: string;
  user?: LoginApiUser;
}

const ROLE_BY_VALUE: { [key: number]: string } = {
  0: 'Underwriter',
  1: 'UnderwritingManager',
  2: 'BrokerOps',
  3: 'ClaimsHandler',
  4: 'Admin'
};

function normalizeRole(role: string | number): string {
  if (typeof role === 'number') {
    return ROLE_BY_VALUE[role] || String(role);
  }
  if (role && !isNaN(Number(role)) && String(Number(role)) === String(role).trim()) {
    const asNum = Number(role);
    return ROLE_BY_VALUE[asNum] || role;
  }
  return role || '';
}

/**
 * Auth handoff in this hybrid app: the AngularJS shell normally owns the
 * login screen. When it links into an Angular 8 island it appends
 * `?token=...` to the URL; on boot this service adopts that token into
 * localStorage (scoped to this origin/port) so subsequent navigation within
 * the island doesn't need the query param anymore.
 *
 * The islands can also run standalone (e.g. hitting http://localhost:4201
 * directly during Angular 8 development) via the `/login` route below,
 * which talks to the same `POST /api/auth/login` endpoint the shell uses
 * and stores the token/user under the exact same localStorage keys
 * (`apex_token` / `apex_user`, see web/apex-shell/config.js) so both apps
 * stay in sync no matter which one signed the user in.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {
    this.hydrateFromQueryString();
  }

  private hydrateFromQueryString(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      // Ports 4200/4201 do not share localStorage — recover a minimal user from the demo token.
      this.tryHydrateUserFromToken(token);
      // Strip the token from the visible URL without reloading the page.
      params.delete('token');
      const cleanQuery = params.toString();
      const newUrl = window.location.pathname + (cleanQuery ? '?' + cleanQuery : '') + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  private tryHydrateUserFromToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token));
      const username = payload.Username || payload.username || '';
      const user: ApexUser = {
        id: payload.UserId || payload.userId || 0,
        username,
        displayName: username || 'User',
        role: normalizeRole(payload.Role || payload.role || '')
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Token may not be demo-JSON; screens still work with bearer alone.
    }
  }

  /** Authenticates directly against the API. Used by the standalone /login screen. */
  login(username: string, password: string): Observable<ApexUser> {
    return this.http.post<LoginApiResponse>(`${environment.apiBaseUrl}/auth/login`, { username, password }).pipe(
      map(res => {
        if (!res || !res.token) {
          throw { status: 401, error: { message: (res && res.errorMessage) || 'Login response did not include a token.' } };
        }
        const user: ApexUser = {
          id: res.user ? res.user.id : 0,
          username: res.user ? res.user.username : username,
          displayName: (res.user && res.user.fullName) || username,
          email: res.user ? res.user.email : undefined,
          // API may serialize UserRole as a number (Newtonsoft default) or string.
          role: normalizeRole(res.user ? res.user.role : ''),
          teamId: res.user ? res.user.teamId : undefined
        };
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  currentUser(): ApexUser {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fall through to default below
      }
    }
    return { id: 0, username: '', displayName: 'Guest', role: '' };
  }

  hasRole(...roles: string[]): boolean {
    const user = this.currentUser();
    return !!user.role && roles.indexOf(user.role) !== -1;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.redirectToShellLogin();
  }

  /**
   * Hybrid auth: session bootstrap lives in the AngularJS shell (same origin).
   */
  redirectToShellLogin(): void {
    const returnTo = encodeURIComponent(window.location.href);
    window.location.href = `/#!/login?returnTo=${returnTo}`;
  }

  /** Alias used by the HTTP interceptor on 401. */
  redirectToLogin(): void {
    this.redirectToShellLogin();
  }

  shellUrl(hashPath: string): string {
    const path = hashPath.indexOf('/') === 0 ? hashPath : '/' + hashPath;
    return `/#!${path}`;
  }
}
