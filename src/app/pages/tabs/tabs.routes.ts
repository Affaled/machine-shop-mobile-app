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
          import('../motorcycle/motorcycle.page').then((c) => c.MotorcyclePage),
      },
      {
        path: 'customer',
        loadComponent: () =>
          import('../customers/customers.page').then((c) => c.CustomersPage),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../products/products.page').then((c) => c.ProductsPage),
      },
            {
        path: 'order',
        loadComponent: () =>
          import('../orders/orders.page').then((c) => c.OrdersPage),
      },
      {
        path: '',
        redirectTo: '/tabs/motorcycle',
        pathMatch: 'full',
      },
      {
        path: 'work',
        loadComponent: () =>
          import('../work/work.page').then((m) => m.WorkPage),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/motorcycle',
    pathMatch: 'full',
  },
];
