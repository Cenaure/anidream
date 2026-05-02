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
      {
        path: Segment.users,
        loadChildren: () => import('./users/users.routes').then(r => r.USERS_ROUTES),
      },
      {
        path: Segment.groups,
        loadChildren: () => import('./groups/groups.routes').then(r => r.GROUPS_ROUTES),
      },
      {
        path: Segment.anime,
        loadChildren: () => import('./anime/anime.router').then(r => r.ANIME_ROUTES)
      },
      {
        path: Segment.producers,
        loadChildren: () => import('./producers/producers.routes').then(r => r.PRODUCERS_ROUTES),
      }
    ]
  }
]
