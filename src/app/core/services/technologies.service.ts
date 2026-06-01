import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Technology, TechnologyInput } from '../models/technology.model';

@Injectable({ providedIn: 'root' })
export class TechnologiesService extends CrudService<Technology, TechnologyInput> {
  readonly endpoint = 'technologies';
  readonly resourceKey = 'technology';
  readonly collectionKey = 'technologies';
}
