import {Component, OnInit, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {HlmTabsImports} from '@spartan-ng/helm/tabs';

@Component({
  selector: 'app-anime-menu',
  imports: [
    HlmTabsImports,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './anime-menu.html',
})
export class AnimeMenu implements OnInit {
  currentTab = signal<string>("list")

  ngOnInit() {
    this.currentTab.set('list')
  }
}
