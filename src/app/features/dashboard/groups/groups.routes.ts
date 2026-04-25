import {Routes} from '@angular/router';
import {GroupMenu} from './group-menu/group-menu';
import {groupResolve} from './group-resolve.guard';

export const GROUPS_ROUTES: Routes = [
  {
    path: '', component: GroupMenu,
    children: [
      {path: 'list', loadComponent: () => import("./groups-list/groups-list").then(c => c.GroupsList)},
      {path: 'new', loadComponent: () => import("./group-edit/group-edit").then(c => c.GroupEdit)},
      {
        path: 'edit/:id', loadComponent: () => import("./group-edit/group-edit").then(c => c.GroupEdit),
        resolve: {
          group: groupResolve
        }
      },
      {path: '', redirectTo: 'list', pathMatch: 'prefix'},
    ]
  }
]
