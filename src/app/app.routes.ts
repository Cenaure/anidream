import { Routes } from '@angular/router';
import {Route, Segment} from './shared/utils/paths';
import {HomeComponent} from './core/pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: Segment.anime,
    loadChildren: () => import("./features/anime/anime.router").then(r => r.ANIME_ROUTES)
  },
  {
    path: Segment.auth,
    loadChildren: () => import("./core/auth/auth.routes").then(r => r.AUTH_ROUTES)
  },
  {
    path: Segment.profile,
    loadChildren: () => import("./features/profile/profile.router").then(r => r.ACCOUNT_ROUTES)
  },
  {
    path: Segment.dashboard,
    loadChildren: () => import("./features/dashboard/dashboard.router").then(r => r.DASHBOARD_ROUTES)
  },
  // {
  //   path: "chat",
  //   loadComponent: () => import("./features/chat/chat").then(c => c.Chat)
  // },
  {
    path: Segment.notFound,
    loadComponent: () => import("./core/pages/not-found-page/not-found-page").then(c => c.NotFoundPage)
  },
  {
    path: "**",
    redirectTo: Route.notFound,
    pathMatch: "full",
  }
];
