import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { CommunityItem } from '../models/community-item.model';

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private api = inject(ApiService);

  list() {
    return this.api.get<{ community_items: CommunityItem[] }>('community_items');
  }

  create(data: Partial<CommunityItem>) {
    return this.api.post<{ community_item: CommunityItem }>('community_items', { community_item: data });
  }

  update(id: number, data: Partial<CommunityItem>) {
    return this.api.patch<{ community_item: CommunityItem }>(`community_items/${id}`, { community_item: data });
  }

  remove(id: number) {
    return this.api.delete<void>(`community_items/${id}`);
  }
}
