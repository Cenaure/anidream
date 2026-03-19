import {Component, signal} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {dashboardGroupsRoute, dashboardRoute, dashboardUsersRoute} from '../../../../shared/utils/paths';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-aside-dashboard-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './aside-dashboard-navigation.html',
})
export class AsideNavigationComponent {
  usersNav = signal<NavItem[]>([
    { label: 'All Users',  route: dashboardUsersRoute,  icon: '👥' },
    { label: 'Groups',     route: dashboardGroupsRoute, icon: '🗂️' },
  ]);
}
