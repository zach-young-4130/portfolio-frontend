import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
    title: 'Zach Young — Full-Stack Engineer',
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then((m) => m.AboutComponent),
    title: 'About — Zach Young',
  },
  {
    path: 'stack',
    loadComponent: () => import('./features/stack/stack').then((m) => m.StackComponent),
    title: 'Stack — Zach Young',
  },
  {
    path: 'code',
    loadComponent: () => import('./features/code/code').then((m) => m.CodeComponent),
    title: 'Code',
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/faq/faq').then((m) => m.FaqComponent),
    title: 'FAQ',
  },
{
    path: 'experience',
    loadComponent: () => import('./features/experience/experience').then((m) => m.ExperienceComponent),
    title: 'Experience',
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then((m) => m.ContactComponent),
    title: 'Contact',
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login').then((m) => m.AdminLoginComponent),
    title: 'Admin Login',
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [adminGuard],
  },
  { path: '**', redirectTo: '' },
];
