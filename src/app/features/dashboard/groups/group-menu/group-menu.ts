import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import {HlmTabsImports} from '@spartan-ng/helm/tabs';
import {dashboardEditGroupRoute, dashboardListGroupsRoute} from '../../../../shared/utils/paths';

@Component({
  selector: 'app-group-menu',
  imports: [
    RouterOutlet,
    HlmTabsImports,
    RouterLink,
  ],
  templateUrl: './group-menu.html',
})
export class GroupMenu implements OnInit{
  constructor(private router: Router) {}

  currentTab = signal<string>("list")

  ngOnInit() {
    if (this.router.url.includes('new') || this.router.url.includes('edit')) {
      this.currentTab.set('edit');
    } else {
      this.currentTab.set('list');
    }
  }
}
