import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private api = inject(ApiService);

  list() {
    return this.api.get<{ projects: Project[] }>('projects');
  }

  get(id: number) {
    return this.api.get<{ project: Project }>(`projects/${id}`);
  }

  create(data: Partial<Project>) {
    return this.api.post<{ project: Project }>('projects', { project: data });
  }

  update(id: number, data: Partial<Project>) {
    return this.api.patch<{ project: Project }>(`projects/${id}`, { project: data });
  }

  remove(id: number) {
    return this.api.delete<void>(`projects/${id}`);
  }
}
