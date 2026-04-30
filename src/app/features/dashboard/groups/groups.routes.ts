import {Routes} from '@angular/router';
import {GroupMenu} from './group-menu/group-menu';
import {groupResolve} from './group-resolve.guard';
import {Route, Segment} from '../../../shared/utils/paths';

export const GROUPS_ROUTES: Routes = [
  {
    path: '', component: GroupMenu,
    children: [
      {path: Segment.list, loadComponent: () => import("./groups-list/groups-list").then(c => c.GroupsList)},
      {path: Segment.new, loadComponent: () => import("./group-edit/group-edit").then(c => c.GroupEdit)},
      {
        path: Segment.edit + '/:id', loadComponent: () => import("./group-edit/group-edit").then(c => c.GroupEdit),
        resolve: {
          group: groupResolve
        }
      },
      {path: '', redirectTo: Route.dashboardListGroups, pathMatch: 'prefix'},
    ]
  }
]
