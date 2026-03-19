import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsideNavigationComponent} from './aside-navigation/aside-dashboard-navigation';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.html',
  imports: [
    RouterOutlet,
    AsideNavigationComponent,
  ]
})
export class DashboardLayout {}
