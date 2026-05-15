import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
    title: 'Zach Young — Full-Stack Developer',
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
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
    path: 'community',
    loadComponent: () => import('./features/community/community').then((m) => m.CommunityComponent),
    title: 'Community',
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
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
