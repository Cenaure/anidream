import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {HlmTabs, HlmTabsImports, HlmTabsList, HlmTabsTrigger} from '@spartan-ng/helm/tabs';

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
