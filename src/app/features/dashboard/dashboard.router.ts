import {Routes} from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./layout/dashboard-layout').then(c => c.DashboardLayout),
    children: [
      {
        path: "",
        loadComponent: () => import('./users/users-page').then(c => c.UsersPage),
      },
      // Create / Edit user
      {
        path: "user-new",
        loadComponent: () => import('./users/user-edit/user-edit').then(c => c.UserEdit),
      },
      {
        path: "user-edit/:id",
        loadComponent: () => import('./users/user-edit/user-edit').then(c => c.UserEdit),
      }
    ],
  }
]
