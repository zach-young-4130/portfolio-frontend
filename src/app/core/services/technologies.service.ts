import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Technology, TechnologyInput } from '../models/technology.model';

@Injectable({ providedIn: 'root' })
export class TechnologiesService {
  private api = inject(ApiService);

  list() {
    return this.api.get<{ technologies: Technology[] }>('technologies');
  }

  create(data: TechnologyInput) {
    return this.api.post<{ technology: Technology }>('technologies', { technology: data });
  }

  update(id: number, data: Partial<TechnologyInput>) {
    return this.api.patch<{ technology: Technology }>(`technologies/${id}`, { technology: data });
  }

  remove(id: number) {
    return this.api.delete<void>(`technologies/${id}`);
  }
}
