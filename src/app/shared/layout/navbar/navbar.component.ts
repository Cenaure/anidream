import {Component, OnInit} from '@angular/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/auth/services/auth.service';
import {signInRoute} from '../../utils/paths';
import {NgOptimizedImage} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorSignIn, phosphorSignOut} from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-navbar',
  imports: [
    HlmButtonImports,
    RouterLink,
    NgOptimizedImage,
    NgIcon,
  ],
  templateUrl: './navbar.component.html',
  viewProviders: [provideIcons({phosphorSignIn, phosphorSignOut})]
})
export class NavbarComponent implements OnInit {
  constructor(readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit() {
    console.log(this.authService.isLoggedIn())
    console.log(this.authService.loggedUser())
  }

  logout() {
    this.authService.logout().subscribe(() =>
      this.router.navigateByUrl(signInRoute)
    );
  }

  protected readonly signInRoute = signInRoute;
}
