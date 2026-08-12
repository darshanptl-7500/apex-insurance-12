import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiError {
  message: string;
  status: number | null;
}

/**
 * Thin REST wrapper shared by every feature module. Centralising this here
 * keeps the base URL, param handling, and error normalisation in one place.
 *
 * The Angular 8 islands assume the same API contract as the AngularJS shell
 * (see /web/README.md "API contract" section) plus a handful of aggregate
 * endpoints for dashboard/reporting/modelling/admin screens:
 *   GET /dashboard/summary
 *   GET /modelling/exposure?groupBy=lob|territory|broker
 *   GET /reporting/premium-vs-target | /broker-league | /pipeline | /loss-ratio
 *   GET /audit?entityType=&entityId=
 *   GET/POST/PUT /admin/users | /admin/rate-tables | /admin/referral-rules | /admin/parameters
 */
@Injectable({ providedIn: 'root' })
export class ApiService {

  readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: { [key: string]: any }): Observable<T> {
    return this.http.get<T>(this.url(path), { params: this.toHttpParams(params) })
      .pipe(catchError(err => this.handleError(err)));
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(this.url(path), body)
      .pipe(catchError(err => this.handleError(err)));
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(this.url(path), body)
      .pipe(catchError(err => this.handleError(err)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.url(path))
      .pipe(catchError(err => this.handleError(err)));
  }

  private url(path: string): string {
    return path.indexOf('http') === 0 ? path : `${this.baseUrl}${path}`;
  }

  private toHttpParams(params?: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    if (!params) { return httpParams; }
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'Unexpected error contacting the API.';
    if (err.status === 0) {
      message = `Could not reach the Apex API at ${this.baseUrl}. Confirm the service is running.`;
    } else if (err.error && err.error.message) {
      message = err.error.message;
    } else if (err.status) {
      message = `API returned HTTP ${err.status} ${err.statusText || ''}`.trim() + '.';
    }
    const apiError: ApiError = { message, status: err.status || null };
    return throwError(apiError);
  }
}
