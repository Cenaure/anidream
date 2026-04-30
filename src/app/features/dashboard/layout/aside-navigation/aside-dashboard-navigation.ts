import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LucideIconData, UsersIcon, LayersIcon } from 'lucide-angular';
import {Route} from '../../../../shared/utils/paths';

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
    { label: 'All Users', route: Route.dashboardUsers,  icon: UsersIcon },
    { label: 'Groups',    route: Route.dashboardListGroups, icon: LayersIcon },
  ]);

  animeNav = signal<NavItem[]>([
    { label: 'Anime', route: Route.dashboardAnime, icon: LayersIcon },
  ])
}
