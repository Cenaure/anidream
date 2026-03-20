import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {dashboardAnimeRoute, dashboardGroupsRoute, dashboardUsersRoute} from '../../../../shared/utils/paths';
import { LucideAngularModule, LucideIconData, UsersIcon, LayersIcon } from 'lucide-angular';

interface NavItem {
  label: string;
  route: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-aside-dashboard-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './aside-dashboard-navigation.html',
})
export class AsideNavigationComponent {
  usersNav = signal<NavItem[]>([
    { label: 'All Users', route: dashboardUsersRoute,  icon: UsersIcon },
    { label: 'Groups',    route: dashboardGroupsRoute, icon: LayersIcon },
  ]);

  animeNav = signal<NavItem[]>([
    { label: 'Anime', route: dashboardAnimeRoute, icon: LayersIcon },
  ])
}
