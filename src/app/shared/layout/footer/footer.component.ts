import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Route} from '../../utils/paths';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly profileRoute = Route.profile;
  protected readonly dashboardRoute = Route.dashboardUsers;
  protected readonly signInRoute = Route.signIn;
  protected readonly topAnimeRoute = Route.topAnime();
  protected readonly randomAnimeRoute = Route.randomAnime();
  protected readonly websiteRepoRoute = Route.websiteRepo;
  protected readonly cenaureRoute = Route.cenaureWebsite;
  protected readonly jikanRoute = Route.jikanWebsite;
}
