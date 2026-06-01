import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Tag, TagInput } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private api = inject(ApiService);

  list() {
    return this.api.get<{ tags: Tag[] }>('tags');
  }

  create(data: TagInput) {
    return this.api.post<{ tag: Tag }>('tags', { tag: data });
  }

  update(id: number, data: Partial<TagInput>) {
    return this.api.patch<{ tag: Tag }>(`tags/${id}`, { tag: data });
  }

  remove(id: number) {
    return this.api.delete<void>(`tags/${id}`);
  }
}
