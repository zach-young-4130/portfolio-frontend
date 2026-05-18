import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from './api.service';
import { Project, ProjectData } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private api = inject(ApiService);

  list() {
    return this.api
      .get<{ projects: ProjectData[] }>('projects')
      .pipe(map((res) => ({ projects: res.projects.map((p) => new Project(p)) })));
  }

  get(id: number) {
    return this.api
      .get<{ project: ProjectData }>(`projects/${id}`)
      .pipe(map((res) => ({ project: new Project(res.project) })));
  }

  create(data: Partial<ProjectData>) {
    return this.api
      .post<{ project: ProjectData }>('projects', { project: data })
      .pipe(map((res) => ({ project: new Project(res.project) })));
  }

  update(id: number, data: Partial<ProjectData>) {
    return this.api
      .patch<{ project: ProjectData }>(`projects/${id}`, { project: data })
      .pipe(map((res) => ({ project: new Project(res.project) })));
  }

  remove(id: number) {
    return this.api.delete<void>(`projects/${id}`);
  }
}
