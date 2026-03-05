import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HlmButton} from '@spartan-ng/helm/button';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardFooter,
  HlmCardHeader,
  HlmCardTitle
} from '@spartan-ng/helm/card';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {provideIcons} from '@ng-icons/core';
import {lucideCheck, lucideChevronDown} from '@ng-icons/lucide';
import {AuthSchema} from '../../_schemas/auth.schema';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [
    FormsModule,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCardDescription,
    HlmCardFooter,
    HlmCardHeader,
    HlmCardTitle,
    HlmInput,
    HlmLabel
  ],
  providers: [provideIcons({lucideCheck, lucideChevronDown})],
  templateUrl: './sign-up.html',
})
export class SignUp {
  constructor(
    private readonly authService: AuthService,
    private router: Router,
  ) {}

  auth = new AuthSchema("John","john");

  errorMessage = signal('')

  login() {
    this.authService.login(this.auth).subscribe({
      next: success => {
        if (success) {
          this.router.navigateByUrl('/dashboard/users')
        } else {
          this.errorMessage.set("Wrong name or password, try again.");
        }
      },
    })
  }
}
