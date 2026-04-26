import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  profileRoute,
  signInRoute,
  dashboardRoute,
  topAnimeRoute,
  randomAnimeRoute,
  websiteRepoRoute, cenaureRoute, jikanRoute
} from '../../utils/paths';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly profileRoute = profileRoute;
  protected readonly dashboardRoute = dashboardRoute;
  protected readonly signInRoute = signInRoute;
  protected readonly topAnimeRoute = topAnimeRoute;
  protected readonly randomAnimeRoute = randomAnimeRoute;
  protected readonly websiteRepoRoute = websiteRepoRoute;
  protected readonly cenaureRoute = cenaureRoute;
  protected readonly jikanRoute = jikanRoute;
}
