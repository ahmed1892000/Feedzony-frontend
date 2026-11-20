import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'auth',
    title: 'Account | Feedzony',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((module) => module.AuthComponent),
  },
  { path: '**', redirectTo: '' },
];
