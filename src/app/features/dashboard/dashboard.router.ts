import {Routes} from '@angular/router';
import {GroupsRoutes} from './groups/groups.routes';

export const DASHBOARD_ROUTES: Routes = [
  { // Dashboard Layout
    path: '',
    loadComponent: () => import('./layout/dashboard-layout').then(c => c.DashboardLayout),

    // Children Routes
    children: [
      //Users
      {
        path: 'users',
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
          },
        ],
      },
      //Groups
      {
        path: "groups",
        loadChildren: () => GroupsRoutes,
      }
    ]
  }
]
