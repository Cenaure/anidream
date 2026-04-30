import {Routes} from '@angular/router';
import {authMatchGuard} from '../../core/auth/auth-guard';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    canMatch: [authMatchGuard],
    loadComponent: () => import("./pages/profile-page.component").then(c => c.ProfilePageComponent)
  }
]
