import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {HlmTabsImports} from '@spartan-ng/helm/tabs';
import {dashboardEditGroupRoute, dashboardListGroupsRoute} from '../../../../shared/utils/paths';

@Component({
  selector: 'app-group-menu',
  imports: [
    RouterOutlet,
    HlmTabsImports,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './group-menu.html',
})
export class GroupMenu {

  protected readonly dashboardListGroupsRoute = dashboardListGroupsRoute;
  protected readonly dashboardEditGroupRoute = dashboardEditGroupRoute;
}
