import {Component, inject} from '@angular/core';
import {AuthService} from '../../../core/auth/services/auth.service';
import {Router} from '@angular/router';
import {Route} from '../../../shared/utils/paths';

@Component({
  selector: 'app-pages',
  imports: [],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  protected readonly router = inject(Router);

  protected readonly authService = inject(AuthService)
  protected readonly user = this.authService.loggedUser;

  logout() {
    this.authService.logout().subscribe(() =>
      this.router.navigateByUrl(Route.signIn)
    );
  }
}
