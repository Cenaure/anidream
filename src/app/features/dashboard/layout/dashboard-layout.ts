import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsideNavigationComponent} from './aside-navigation/aside-dashboard-navigation';

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
export class DashboardLayout {}
