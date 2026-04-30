import {Routes} from '@angular/router';
import {authMatchGuard} from '../../core/auth/auth-guard';
import {Segment} from '../../shared/utils/paths';

export const DASHBOARD_ROUTES: Routes = [
  { // Dashboard Layout
    path: '',
    loadComponent: () => import('./layout/dashboard-layout').then(c => c.DashboardLayout),
    // Auth Guard
    canMatch: [authMatchGuard],
    // Children Routes
    children: [
      //Users
      {
        path: Segment.users,
        children: [
          {
            path: "",
            loadComponent: () => import('./users/users-page.component').then(c => c.UsersPageComponent),
          },
          // Create / Edit user
          {
            path: Segment.new,
            loadComponent: () => import('./users/user-edit/user-edit').then(c => c.UserEdit),
          },
          {
            path: Segment.edit + "/:id",
            loadComponent: () => import('./users/user-edit/user-edit').then(c => c.UserEdit),
          },
        ],
      },
      //Groups
      {
        path: Segment.groups,
        loadChildren: () => import('./groups/groups.routes').then(r => r.GROUPS_ROUTES),
      },
      {
        path: Segment.anime,
        loadChildren: () => import('./anime/anime.router').then(r => r.ANIME_ROUTES)
      }
    ]
  }
]
