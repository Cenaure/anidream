import {Component, inject, signal} from '@angular/core';
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
import {Router, RouterLink} from '@angular/router';
import {AuthService, SignUpDto} from '../../services/auth.service';
import {email, form, FormField, minLength, required, validate} from '@angular/forms/signals';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import {Route} from '../../../../shared/utils/paths';
import {MetadataService} from '../../../../shared/services/metadata.service';

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
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  //region: ---constructor
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly metadataService = inject(MetadataService)
  constructor() {
    zxcvbnOptions.setOptions({
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    })
  }
  //endregion: ---constructor

  ngOnInit() {
    this.metadataService.updateMetadata({
      title: "Create a new account",
    })
  }

  //region: ---formDeclaration
  // aka react hook forms
  // but without zod validation :(
  model = signal<SignUpDto & {confirmPassword: string}>({
    username: '', // Name
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Oh, they actually have zod validation 0_0
  signUpForm = form(this.model, schemaPath => {
    required(schemaPath.username, {message: "Username is required"})
    minLength(schemaPath.username, 3, {message: "Username must have at least 3 characters"})
    required(schemaPath.email, {message: "Email is required"})
    email(schemaPath.email, {message: "Invalid email"})
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
    validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(schemaPath.password)) {
        return { kind: 'passwordMismatch', message: 'Passwords do not match' };
      }
      return null;
    });
  })
  //endregion: ---formDeclaration

  // Server Error
  errorMessage = signal('')

  signUp() {
    this.signUpForm().markAsTouched();
    if (this.signUpForm().invalid()) return;

    const data = this.model()

    // AuthService Sign-Up
    this.authService.signUp(data).subscribe(savedUser => {
      this.router.navigateByUrl(Route.dashboardUsers);
    })
  }

  protected readonly signInRoute = Route.signIn;
}
