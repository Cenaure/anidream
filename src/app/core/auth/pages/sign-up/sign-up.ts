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
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {email, form, FormField, minLength, pattern, required, validate} from '@angular/forms/signals';
import {UserSchema} from '../../../../features/dashboard/users/_schemas/user.schema';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

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
    HlmLabel,
    RouterLink,
    FormField
  ],
  providers: [provideIcons({lucideCheck, lucideChevronDown})],
  templateUrl: './sign-up.html',
})
export class SignUp {
  //region: ---constructor
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    const options = {
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    }
    zxcvbnOptions.setOptions(options)
  }
  //endregion: ---constructor

  //region: ---formDeclaration
  // aka react hook forms
  // but without zod validation :(
  model = signal({
    login: '', // Name
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Oh, they actually have zod validation 0_0
  signUpForm = form(this.model, schemaPath => {
    required(schemaPath.login, {message: "Username is required"})
    minLength(schemaPath.login, 3, {message: "Username must have at least 3 characters"})
    required(schemaPath.email, {message: "Email is required"})
    email(schemaPath.email, {message: "Invalid email"})
    //pattern(schemaPath.email, /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/, {message: "Invalid email"})
    required(schemaPath.password, {message: "Password is required"})
    validate(schemaPath.password, ({ value }) => {
      const password = value();

      if (!password) return null;

      const result = zxcvbn(password);

      const feedback = result.feedback.suggestions.join(' ');
      const crackTime = result.crackTimesDisplay.offlineSlowHashing1e4PerSecond;

      if (result.score === 0) {
        return { kind: 'weakPassword', message: `Too weak. ${feedback}` };
      }
      if (result.score === 1) {
        return { kind: 'weakPassword', message: `Very weak — crack time: ${crackTime}. ${feedback}` };
      }
      if (result.score === 2) {
        return { kind: 'weakPassword', message: `Weak — crack time: ${crackTime}. ${feedback}` };
      }

      return null;
    })
    required(schemaPath.confirmPassword, {message: "Confirm your password"})
    validate(schemaPath.confirmPassword, ({ value }) => {
      if (value() !== this.model().password) {
        return { kind: 'passwordMismatch', message: 'Passwords do not match' };
      }
      return null;
    });
  })
  //endregion: ---formDeclaration

  // Server Error
  errorMessage = signal('')

  signUp(event: any) {
    //region: ---UserFormat
    event.preventDefault();
    const data = this.model()
    const user = new UserSchema(data.login, data.email, undefined, undefined, data.password)
    //endregion: ---UserFormat

    // AuthService Sign-Up
    this.authService.sign_up(user).subscribe(savedUser => {
      this.router.navigateByUrl('/dashboard');
    })
  }
}
