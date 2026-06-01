import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Tag, TagInput } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagsService extends CrudService<Tag, TagInput> {
  readonly endpoint = 'tags';
  readonly resourceKey = 'tag';
  readonly collectionKey = 'tags';
}
