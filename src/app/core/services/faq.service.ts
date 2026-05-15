import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { FaqItem } from '../models/faq-item.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private api = inject(ApiService);

  list() {
    return this.api.get<{ faq_items: FaqItem[] }>('faq_items');
  }

  create(data: Partial<FaqItem>) {
    return this.api.post<{ faq_item: FaqItem }>('faq_items', { faq_item: data });
  }

  update(id: number, data: Partial<FaqItem>) {
    return this.api.patch<{ faq_item: FaqItem }>(`faq_items/${id}`, { faq_item: data });
  }

  remove(id: number) {
    return this.api.delete<void>(`faq_items/${id}`);
  }
}
