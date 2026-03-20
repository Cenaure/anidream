import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./pages/home/home.component").then(c => c.HomeComponent),
  },
  {
    path: "auth",
    loadChildren: () => import("./core/auth/auth.routes").then(r => r.AUTH_ROUTES)
  },
  {
    path: "account",
    loadChildren: () => import("./features/account/account.router").then(r => r.ACCOUNT_ROUTES)
  },
  {
    path: "dashboard",
    loadChildren: () => import("./features/dashboard/dashboard.router").then(r => r.DASHBOARD_ROUTES)
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  }
];
