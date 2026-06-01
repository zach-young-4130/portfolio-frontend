import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export abstract class CrudService<T, TInput = Partial<T>> {
  protected api = inject(ApiService);

  abstract readonly endpoint: string;
  abstract readonly resourceKey: string;
  abstract readonly collectionKey: string;

  list(): Observable<T[]> {
    return this.api
      .get<Record<string, T[]>>(this.endpoint)
      .pipe(map((res) => res[this.collectionKey]));
  }

  create(data: TInput): Observable<T> {
    return this.api
      .post<Record<string, T>>(this.endpoint, { [this.resourceKey]: data })
      .pipe(map((res) => res[this.resourceKey]));
  }

  update(id: number, data: Partial<TInput>): Observable<T> {
    return this.api
      .patch<Record<string, T>>(`${this.endpoint}/${id}`, { [this.resourceKey]: data })
      .pipe(map((res) => res[this.resourceKey]));
  }

  remove(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
