import {Component, OnInit, signal} from '@angular/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/auth/services/auth.service';
import {NgOptimizedImage} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorSignIn, phosphorSignOut} from '@ng-icons/phosphor-icons/regular';
import {FormsModule} from '@angular/forms';
import {Route} from '../../utils/paths';

@Component({
  selector: 'app-navbar',
  imports: [
    HlmButtonImports,
    RouterLink,
    NgOptimizedImage,
    NgIcon,
    FormsModule,
  ],
  templateUrl: './navbar.component.html',
  viewProviders: [provideIcons({phosphorSignIn, phosphorSignOut})]
})
export class NavbarComponent implements OnInit {
  constructor(readonly authService: AuthService, private readonly router: Router) {}
  protected readonly signInRoute = Route.signIn;

  ngOnInit() {
    console.log(this.authService.isLoggedIn())
    console.log(this.authService.loggedUser())
  }

  logout() {
    this.authService.logout().subscribe(() =>
      this.router.navigateByUrl(this.signInRoute)
    );
  }


  //Search
  query = signal('');

  onSearch() {
    if (!this.query().trim()) return;
    this.router.navigate([Route.searchAnime()], { queryParams: { q: this.query().trim() } });
  }
}
