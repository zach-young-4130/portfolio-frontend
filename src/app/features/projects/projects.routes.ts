import { Routes } from '@angular/router';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./projects-list/projects-list').then((m) => m.ProjectsListComponent),
    title: 'Projects',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./project-detail/project-detail').then((m) => m.ProjectDetailComponent),
  },
];
