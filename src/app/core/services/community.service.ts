import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { CommunityItem } from '../models/community-item.model';

@Injectable({ providedIn: 'root' })
export class CommunityService extends CrudService<CommunityItem, Partial<CommunityItem>> {
  readonly endpoint = 'community_items';
  readonly resourceKey = 'community_item';
  readonly collectionKey = 'community_items';
}
