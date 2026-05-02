import {Routes} from '@angular/router';
import {Segment} from '../../../shared/utils/paths';


export const USERS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import('./pages/users-list/users-list.component').then(c => c.UsersListComponent),
  },
  {
    path: Segment.new,
    loadComponent: () => import('./pages/user-edit/./user-edit.component').then(c => c.UserEditComponent),
  },
  {
    path: Segment.edit + "/:id",
    loadComponent: () => import('./pages/user-edit/./user-edit.component').then(c => c.UserEditComponent),
  },
]
