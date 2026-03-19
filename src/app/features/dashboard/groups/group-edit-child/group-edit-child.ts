import {Component, computed, effect, input, linkedSignal, OnInit, output, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmButton} from '@spartan-ng/helm/button';
import {
  HlmCardImports,
} from '@spartan-ng/helm/card';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {form, FormField, required} from '@angular/forms/signals';
import {map, tap} from 'rxjs';
import {UsersService} from '../../users/services/users.service';
import {Group} from '../../users/_schemas/user.schema';

@Component({
  selector: 'app-group-edit-child',
  imports: [
    FormsModule,
    HlmButton,
    HlmCardImports,
    HlmInput,
    HlmLabel,
    ReactiveFormsModule,
    FormField
  ],
  templateUrl: './group-edit-child.html',
})
export class GroupEditChild {
  //region: ---constructor
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
  ) {
    effect(() => {
      const id = this.group()?.id;
      if (id) this.loadGroup(id);
    });
  }

  group = input<Group>()
  groupSaved = output<Group>()
  //endregion: ---constructor

  //region: ---formDeclaration
  model = linkedSignal(() => {
    const g = this.group();
    const permString = g
      ? g.permissions.join(', ')
      : '';
    return { name: g?.name || '',
      permissions: permString
    }
  });


  groupEditForm = form(this.model, schemaPath => {
    required(schemaPath.name, {message: "Name is required"})
  })
  //endregion: ---formDeclaration

  id = computed(() => this.group()?.id);

  loadGroup(groupId: string) {
    this.usersService.getGroup(groupId).subscribe(group => {
      this.model.set({
        name: group.name,
        permissions: group.permissions.join(",")
      })
    })
  }

  // Server Error
  errorMessage = signal('')

  saveGroup(event: any) {
    event.preventDefault();

    // const token = this.authService.token

    const perms = this.model().permissions.split(',').map(value => value.trim()).filter(value => value);

    const groupToSave = new Group(this.model().name, perms, this.id());
    this.usersService.saveGroup(groupToSave).subscribe(() => {
      this.groupSaved.emit(groupToSave);
    });
  }
}
