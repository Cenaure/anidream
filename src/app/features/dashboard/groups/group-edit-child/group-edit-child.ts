import {Component, computed, input, linkedSignal, output, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmButton} from '@spartan-ng/helm/button';
import {
  HlmCardImports,
} from '@spartan-ng/helm/card';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {form, FormField, required} from '@angular/forms/signals';
import {UsersService} from '../../users/services/users.service';
import {IGroup} from '../../users/_schemas/user.schema';

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
    // effect(() => {
    //   const id = this.group()?.id;
    //   if (id) this.loadGroup(id);
    // });
  }

  group = input<IGroup>()
  groupSaved = output<IGroup>()
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

    const permissions = this.model().permissions.split(',').map(value => value.trim()).filter(value => value);

    const groupToSave = {
      id: this.id(),
      name: this.model().name,
      permissions,
    } as IGroup

    this.usersService.saveGroup(groupToSave).subscribe(() => {
      this.groupSaved.emit(groupToSave);
    });
  }
}
