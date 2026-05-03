import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {Route} from '../../../../shared/utils/paths';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorFilmSlate, phosphorHouse, phosphorStack, phosphorUsers} from '@ng-icons/phosphor-icons/regular';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-aside-dashboard-navigation',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({phosphorUsers, phosphorStack, phosphorFilmSlate, phosphorHouse})],
  templateUrl: './aside-dashboard-navigation.html',
})
export class AsideNavigationComponent {
  usersNav = signal<NavItem[]>([
    { label: 'All Users', route: Route.dashboardUsers,  icon: 'phosphorUsers' },
    { label: 'Groups',    route: Route.dashboardListGroups, icon: 'phosphorStack' },
  ]);

  animeNav = signal<NavItem[]>([
    { label: 'Anime', route: Route.dashboardListAnime(), icon: 'phosphorFilmSlate' },
    { label: 'Producers', route: Route.dashboardProducers, icon: 'phosphorHouse' },
  ])
}
