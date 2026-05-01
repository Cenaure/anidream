import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {HlmTabsImports} from '@spartan-ng/helm/tabs';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, startWith, tap} from 'rxjs';

@Component({
  selector: 'app-group-menu',
  imports: [
    RouterOutlet,
    HlmTabsImports,
    RouterLink,
  ],
  templateUrl: './group-menu.component.html',
})
export class GroupMenuComponent {
  private router = inject(Router);

  currentTab = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.url.includes('new') || this.router.url.includes('edit') ? 'edit' : 'list')
    )
  );
}
