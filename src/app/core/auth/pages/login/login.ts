import {Component, OnInit, signal} from '@angular/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmCardImports} from '@spartan-ng/helm/card';
import {HlmInputImports} from '@spartan-ng/helm/input';
import {HlmLabelImports} from '@spartan-ng/helm/label';
import {provideIcons} from '@ng-icons/core';
import {lucideCheck, lucideChevronDown} from '@ng-icons/lucide';
import {AuthService} from '../../services/auth.service';
import {AuthSchema} from '../../_schemas/auth.schema';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [HlmButtonImports, HlmInputImports, HlmLabelImports, HlmCardImports, FormsModule, RouterLink],
  providers: [provideIcons({lucideCheck, lucideChevronDown})],
  host: {
    class: 'contents',
  },
  templateUrl: './login.html',
})
export class LoginPage {
  //region: ---constructor
  constructor(
    private readonly authService: AuthService,
    private router: Router,
  ) {}
  //endregion: ---constructor

  //region: ---login
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
  //endregion: ---login
}
