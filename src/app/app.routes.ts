import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'motorcycle',
    loadComponent: () =>
      import('./pages/motorcycle/motorcycle.page').then(
        (m) => m.MotorcyclePage
      ),
  },
];
