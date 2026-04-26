import { Routes } from '@angular/router';
import {animeRoute, authRoute, dashboardRoute, notFoundRoute, profileRoute} from './shared/utils/paths';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./core/pages/home/home.component").then(c => c.HomeComponent),
  },
  {
    path: 'anime',
    loadChildren: () => import("./features/anime/anime.router").then(r => r.ANIME_ROUTES)
  },
  {
    path: authRoute,
    loadChildren: () => import("./core/auth/auth.routes").then(r => r.AUTH_ROUTES)
  },
  {
    path: profileRoute,
    loadChildren: () => import("./features/account/account.router").then(r => r.ACCOUNT_ROUTES)
  },
  {
    path: dashboardRoute,
    loadChildren: () => import("./features/dashboard/dashboard.router").then(r => r.DASHBOARD_ROUTES)
  },
  {
    path: "chat",
    loadComponent: () => import("./features/chat/chat").then(c => c.Chat)
  },
  {
    path: notFoundRoute,
    loadComponent: () => import("./core/pages/not-found-page/not-found-page").then(c => c.NotFoundPage)
  },
  {
    path: "**",
    redirectTo: notFoundRoute,
    pathMatch: "full",
  }
];
