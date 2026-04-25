import {Component, OnInit} from '@angular/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {LucideAngularModule, LogInIcon} from 'lucide-angular';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../core/auth/services/auth.service';
import {signInRoute, chatPageRoute} from '../../utils/paths';

@Component({
  selector: 'app-navbar',
  imports: [
    HlmButtonImports,
    LucideAngularModule,
    RouterLink,
  ],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  constructor(readonly authService: AuthService, private readonly router: Router) {
  }

  readonly LogInIcon = LogInIcon;

  ngOnInit() {
    console.log(this.authService.isLoggedIn())
    console.log(this.authService.loggedUser())
  }

  logout() {
    this.authService.logout().subscribe(() =>
      this.router.navigateByUrl(signInRoute)
    );
  }
}
