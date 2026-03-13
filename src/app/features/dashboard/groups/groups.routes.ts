import {Routes} from '@angular/router';
import {GroupMenu} from './group-menu/group-menu';

export const GroupsRoutes: Routes = [
  {path: "", component: GroupMenu,
    children: [
      {path: 'list', loadComponent: () => import("./groups-list/groups-list").then(c => c.GroupsList)},
      {path: 'edit', loadComponent: () => import("./group-edit/group-edit").then(c => c.GroupEdit)},
    ]
  }
]
