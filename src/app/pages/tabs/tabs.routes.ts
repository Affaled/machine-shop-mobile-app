import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'motorcycle',
        loadComponent: () =>
          import('../motorcycle/motorcycle.page').then((m) => m.MotorcyclePage),
      },
      {
        path: 'customer',
        loadComponent: () =>
          import('../customers/customers.page').then((m) => m.CustomersPage),
      },
      {
        path: '',
        redirectTo: '/tabs/motorcycle',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/motorcycle',
    pathMatch: 'full',
  },
];
