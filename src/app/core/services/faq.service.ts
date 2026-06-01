import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { FaqItem } from '../models/faq-item.model';

@Injectable({ providedIn: 'root' })
export class FaqService extends CrudService<FaqItem, Partial<FaqItem>> {
  readonly endpoint = 'faq_items';
  readonly resourceKey = 'faq_item';
  readonly collectionKey = 'faq_items';
}
