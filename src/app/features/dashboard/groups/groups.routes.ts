import {Routes} from '@angular/router';
import {GroupMenuComponent} from './layout/group-menu/group-menu.component';
import {groupResolve} from './group-resolve.guard';
import {Route, Segment} from '../../../shared/utils/paths';

export const GROUPS_ROUTES: Routes = [
  {
    path: '', component: GroupMenuComponent,
    children: [
      {path: Segment.list, loadComponent: () => import("./components/groups-list/groups-list.component").then(c => c.GroupsListComponent)},
      {path: Segment.new, loadComponent: () => import("./components/group-edit/group-edit.component").then(c => c.GroupEditComponent)},
      {
        path: Segment.edit + '/:id', loadComponent: () => import("./components/group-edit/group-edit.component").then(c => c.GroupEditComponent),
        resolve: {
          group: groupResolve
        }
      },
      {path: '', redirectTo: Route.dashboardListGroups, pathMatch: 'prefix'},
    ]
  }
]
