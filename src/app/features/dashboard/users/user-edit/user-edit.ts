import {Component, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HlmButton} from '@spartan-ng/helm/button';
import {
  HlmCard, HlmCardContent, HlmCardDescription,
  HlmCardFooter, HlmCardHeader, HlmCardTitle
} from '@spartan-ng/helm/card';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import {zxcvbnOptions} from '@zxcvbn-ts/core';
import {email, form, FormField, minLength, required} from '@angular/forms/signals';
import {IUser, mapUser} from '../_schemas/user.schema';
import {UsersService} from '../services/users.service';
import {HlmCheckbox} from '@spartan-ng/helm/checkbox';
import {DestroyRef, inject} from '@angular/core';
import {map, of, switchMap, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Route} from '../../../../shared/utils/paths';
import {IGroup} from '../../groups/_schemas/group.schema';

@Component({
  selector: 'app-user-edit',
  imports: [
    FormsModule, HlmButton, HlmCard, HlmCardContent, HlmCardDescription,
    HlmCardFooter, HlmCardHeader, HlmCardTitle, HlmInput, HlmLabel,
    FormField, HlmCheckbox
  ],
  templateUrl: './user-edit.html',
})
export class UserEdit implements OnInit {
  //region: ---constructor
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    zxcvbnOptions.setOptions({
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    });
  }

  readonly userId = signal<string | null>(null); // string — MongoDB ObjectId
  readonly inputUser = signal<IUser | null>(null);
  //endregion: ---constructor

  //region: ---ngOnInit
  groupsFromServer = signal<IGroup[]>([]);
  errorMessage = signal('');

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      tap(userId => this.userId.set(userId)),
      switchMap(userId =>
        userId
          ? this.usersService.getUser(userId)
          : of(mapUser({username: '', email: '', password: ''}))
      ),
      tap(user => {
        console.log(user)
        this.inputUser.set(user);
        this.model.set({
          username: user.username,
          email: user.email,
          password: '',
          // isActive: user.active ?? false,
        });
      }),
      switchMap(() => this.usersService.getGroups({page: 1, perPage: 1000})),
      tap(res => {
        this.groupsFromServer.set(res.data);
        const userGroups = this.inputUser()?.groups ?? [];
        this.selectedGroups.set(
          res.data.filter(g => userGroups.some(ug => ug === g.id))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
  //endregion: ---ngOnInit

  //region: ---Form
  model = signal({
    username: '',
    email: '',
    password: '',
    // isActive: false,
  });

  userEditForm = form(this.model, schemaPath => {
    required(schemaPath.username, {message: "Username is required"})
    minLength(schemaPath.username, 3, {message: "Username must have at least 3 characters"})
    required(schemaPath.email, {message: "Email is required"})
    email(schemaPath.email, {message: "Invalid email"})
  });
  //endregion: ---Form

  //region: ---Groups
  selectedGroups = signal<IGroup[]>([]);

  toggleGroup(group: IGroup, checked: boolean) {
    this.selectedGroups.update(groups =>
      checked ? [...groups, group] : groups.filter(g => g.id !== group.id)
    );
  }
  //endregion: ---Groups

  save() {
    if (this.userEditForm().invalid()) return;

    const data = this.model();
    const user = {
      username: data.username,
      email: data.email,
      id: this.userId() ?? undefined,
      last_login: undefined,
      password: data.password, // active deleted
      groups: this.selectedGroups().map(g => g.id || '')
    } as IUser;

    console.log(user)
    this.usersService.saveUser(user).subscribe({
      next: () => this.router.navigateByUrl(Route.dashboardUsers),
      error: (err) => this.errorMessage.set(err.message ?? 'Something went wrong')
    });
  }
}
