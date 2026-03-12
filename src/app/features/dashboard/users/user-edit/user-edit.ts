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
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import {zxcvbnOptions} from '@zxcvbn-ts/core';
import {email, form, FormField, minLength, required} from '@angular/forms/signals';
import {Group, UserSchema} from '../_schemas/user.schema';
import {HlmSwitch} from '@spartan-ng/helm/switch';
import {UsersService} from '../services/users.service';
import {HlmCheckbox} from '@spartan-ng/helm/checkbox';
import {dashboardUsersRoute} from '../../../../shared/utils/paths';
import {map, of, switchMap, tap} from 'rxjs';

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
    private readonly route: ActivatedRoute,
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

  // TODO Must be mongodb ObjectId
  readonly userId = signal<number | null>(null);
  readonly inputUser = signal<UserSchema | null>(null);
  //endregion: ---constructor

  //region: ---ngOnInit: groups loading
  groupsFromServer = signal<Group[]>([])

  ngOnInit() {
    // this.userId.set(Number(this.route.snapshot.params['id']))
//this.userId.set(Number(params.get("id")) || null)
    const token = this.authService.token;

    this.route.paramMap.pipe(
      map(params => Number(params.get('id')) || null),
      tap(userId => {
        this.userId.set(userId)
      }),
      switchMap(userId => userId ? this.usersService.getUser(userId, token) : of(
        new UserSchema('', '')
      )),
      tap(user => {
        this.inputUser.set(user);
        this.model.set({
          login: user.name,
          email: user.email,
          isActive: user.active,
          password: ''
        })
      }),
      switchMap(user => this.usersService.getGroups()),
      tap(groups => {
        this.groupsFromServer.set(groups);

        const userGroups = this.inputUser()?.groups ?? [];

        this.selectedGroups.set(
          groups.filter(g => userGroups.some(ug => ug.id === g.id))
        );
      })
    ).subscribe()
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
    required(schemaPath.email, {message: "Email is required"})
    email(schemaPath.email, {message: "Invalid email"})
  })
  //endregion: ---formDeclaration

  //region: ---groups Selected/Toggle
  selectedGroups = signal<Group[]>([]);

  toggleGroup(group: Group, checked: boolean) {
    this.selectedGroups.update(groups =>
      checked ? [...groups, group] : groups.filter(g => g.id !== group.id)
    );
  }

  // Server Error
  errorMessage = signal('')
  //endregion: ---groups


  save(event: any) {
    event.preventDefault();

    //region: ---UserFormat
    const data = this.model()
    const user = new UserSchema(data.login, data.email, this.userId() || undefined, undefined, data.password, data.isActive, this.selectedGroups())
    //endregion: ---UserFormat

    const token = this.authService.token;

    // UsersService Add New User
    this.usersService.saveUser(user, token).subscribe(createdUser => {
      this.router.navigateByUrl(dashboardUsersRoute);
    })
  }
}
