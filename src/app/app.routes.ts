import { Routes } from '@angular/router';
import { Valentines2026 } from './valentines-2026/valentines-2026';

export const routes: Routes = [
  { path: 'valentines-2026', component: Valentines2026 },
  { path: '', pathMatch: 'full', redirectTo: '/valentines-2026' },
  { path: '**', redirectTo: '/valentines-2026' },
];
