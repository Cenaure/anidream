import {Component, OnInit, signal} from '@angular/core';
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
import {AuthService} from '../../../../core/auth/services/auth.service';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import {zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import {email, form, FormField, minLength, required, validate, validateAsync} from '@angular/forms/signals';
import {Group, UserSchema} from '../_schemas/user.schema';
import {rxResource} from '@angular/core/rxjs-interop';
import {BrnSwitch} from '@spartan-ng/brain/switch';
import {HlmSwitch} from '@spartan-ng/helm/switch';
import {UsersService} from '../services/users.service';
import {HlmCheckbox} from '@spartan-ng/helm/checkbox';

@Component({
  selector: 'app-user-edit',
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
    FormField,
    HlmSwitch,
    HlmCheckbox
  ],
  templateUrl: './user-edit.html',
})
export class UserEdit implements OnInit{
  //region: ---constructor
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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

  //region: ---ngOnInit: groups loading
  groupsFromServer = signal<Group[]>([])

  ngOnInit() {
    this.usersService.getGroups().subscribe(groups => {
      this.groupsFromServer.set(groups);
    })
  }
  //endregion: ---ngOnInit groups loading

  //region: ---formDeclaration
  // aka react hook forms
  // but without zod validation :(
  model = signal({
    login: '', // Name
    email: '',
    password: '',
    isActive: false,
  })

  // Oh, they actually have zod validation 0_0
  signUpForm = form(this.model, schemaPath => {
    required(schemaPath.login, {message: "Username is required"})
    minLength(schemaPath.login, 3, {message: "Username must have at least 3 characters"})
    validateAsync(schemaPath.login, {
      params: input => {
        const login = input.value()
        return new UserSchema(login, "")
      },
      factory: (params) => rxResource<string[], UserSchema>({
        params: () => params() || new UserSchema('', ''),
        stream: ({ params: user }) => this.authService.userConflicts(user)
      }),
      onSuccess: result => {
        if (result && result.length > 0) {
          return { kind: 'loginTaken', message: 'This login is already in use' }
        }
        return null
      },
      onError: error => null
    })
    required(schemaPath.email, {message: "Email is required"})
    email(schemaPath.email, {message: "Invalid email"})
    validateAsync(schemaPath.email, {
      params: input => {
        const email = input.value()
        return new UserSchema('', email)
      },
      factory: (params) => rxResource<string[], UserSchema>({
        params: () => params() || new UserSchema('', ''),
        stream: ({ params: user }) => this.authService.userConflicts(user)
      }),
      onSuccess: result => {
        if (result && result.length > 0) {
          return { kind: 'emailTaken', message: 'This email is already in use' }
        }
        return null
      },
      onError: error => null
    })
    required(schemaPath.password, {message: "Password is required"})
  })
  //endregion: ---formDeclaration

  //region: ---groups
  selectedGroups = signal<Group[]>([]);

  toggleGroup(group: Group, checked: boolean) {
    console.log(group)
    this.selectedGroups.update(groups =>
      checked ? [...groups, group] : groups.filter(g => g.id !== group.id)
    );
  }

  // Server Error
  errorMessage = signal('')
  //endregion: ---groups


  signUp(event: any) {
    console.log(this.selectedGroups())

    return;
    //region: ---UserFormat
    event.preventDefault();
    const data = this.model()
    const user = new UserSchema(data.login, data.email, undefined, undefined, data.password, data.isActive, this.selectedGroups())
    //endregion: ---UserFormat

    // AuthService Sign-Up
    this.authService.sign_up(user).subscribe(savedUser => {
      this.router.navigateByUrl('/dashboard');
    })
  }
}
