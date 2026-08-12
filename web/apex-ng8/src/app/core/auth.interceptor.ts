import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;

    if (req.url.indexOf(environment.apiBaseUrl) === 0) {
      const token = this.auth.getToken();
      if (token) {
        request = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      }
    }

    return next.handle(request).pipe(
      catchError(err => {
        // Don't bounce away while the user is submitting credentials on /login.
        const isLoginCall = req.url.indexOf('/auth/login') >= 0;
        if (err && err.status === 401 && !isLoginCall) {
          this.auth.redirectToLogin();
        }
        return throwError(err);
      })
    );
  }
}
