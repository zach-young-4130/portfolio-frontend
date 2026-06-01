import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const REQUEST_TIMEOUT_MS = 8000;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  get<T>(path: string, params?: Record<string, string>): Observable<T> {
    return this.http.get<T>(`${this.base}/${path}`, params ? { params } : {}).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      retry({ count: 2, delay: 1500 }),
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.base}/${path}`, body).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.base}/${path}`, body).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}/${path}`).pipe(timeout(REQUEST_TIMEOUT_MS));
  }
}
