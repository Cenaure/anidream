import {Component, OnInit, signal} from '@angular/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/auth/services/auth.service';
import {NgOptimizedImage} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorSignIn, phosphorUserCheck} from '@ng-icons/phosphor-icons/regular';
import {FormsModule} from '@angular/forms';
import {Route} from '../../utils/paths';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-navbar',
  imports: [
    HlmButtonImports,
    RouterLink,
    NgOptimizedImage,
    NgIcon,
    FormsModule,
    FormField,
  ],
  templateUrl: './navbar.component.html',
  viewProviders: [provideIcons({phosphorSignIn, phosphorUserCheck})]
})
export class NavbarComponent {
  constructor(readonly authService: AuthService, private readonly router: Router) {}
  protected readonly signInRoute = Route.signIn;

  logout() {
    this.authService.logout().subscribe(() =>
      this.router.navigateByUrl(this.signInRoute)
    );
  }

  // Search
  searchModel = signal<{q: string}>({
    q: ""
  })

  searchForm = form(this.searchModel)

  onSearch() {
    if (!this.searchModel().q.trim()) return;
    this.router.navigate([Route.searchAnime()], { queryParams: { q: this.searchModel().q } });
  }

  protected readonly profileRoute = Route.profile;
}
