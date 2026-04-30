import {Component, inject, signal} from '@angular/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmCardImports} from '@spartan-ng/helm/card';
import {HlmInputImports} from '@spartan-ng/helm/input';
import {HlmLabelImports} from '@spartan-ng/helm/label';
import {AuthService} from '../../services/auth.service';
import {AuthData, AuthSchema} from '../../_schemas/auth.schema';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {Route} from '../../../../shared/utils/paths';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-sign-in-component',
  imports: [HlmButtonImports, HlmInputImports, HlmLabelImports, HlmCardImports, FormsModule, RouterLink, FormField],
  host: {
    class: 'contents',
  },
  templateUrl: './sign-in.component.html',
})
export class LoginPage {
  //region: ---injections
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);
  //endregion: ---injections
  protected readonly signUpRoute = Route.signUp;

  //region: ---sign-in

  signInModel = signal<AuthData>({
    username_or_email: '',
    password: ''
  })

  signInForm = form(this.signInModel)

  errorMessage = signal('')

  onSubmit(event: Event) {
    this.authService.signIn(this.signInModel()).subscribe({
      next: success => {
        if (success) {
          this.router.navigateByUrl(Route.dashboardUsers)
        } else {
          this.errorMessage.set("Wrong name or password, try again.");
        }
      },
    })
  }
  //endregion: ---sign-in
}
