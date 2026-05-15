import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.AdminDashboardComponent),
    title: 'Admin',
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/admin-projects').then((m) => m.AdminProjectsComponent),
    title: 'Admin · Projects',
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/admin-faq').then((m) => m.AdminFaqComponent),
    title: 'Admin · FAQ',
  },
  {
    path: 'community',
    loadComponent: () => import('./community/admin-community').then((m) => m.AdminCommunityComponent),
    title: 'Admin · Community',
  },
  {
    path: 'messages',
    loadComponent: () => import('./messages/admin-messages').then((m) => m.AdminMessagesComponent),
    title: 'Admin · Messages',
  },
];
