import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsideNavigationComponent} from './aside-navigation/aside-dashboard-navigation';
import {MetadataService} from '../../../shared/services/metadata.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    AsideNavigationComponent,
  ],
  template: `
    <div class="bg-zinc-900/70 grid grid-cols-12 gap-8">
      <div class="col-span-2">
        <app-aside-dashboard-navigation />
      </div>
      <div class="p-4 relative w-auto col-span-10">
        <router-outlet />
      </div>
    </div>
  `
})
export class DashboardLayout implements OnInit {
  private readonly metadataService = inject(MetadataService)

  ngOnInit() {
    this.metadataService.updateMetadata({
      title: 'Dashboard',
      description: 'Manage users, groups and anime'
    })
  }
}
