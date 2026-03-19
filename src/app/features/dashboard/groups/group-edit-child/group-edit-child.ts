import {Component, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmButton} from '@spartan-ng/helm/button';
import {
  HlmCardImports,
} from '@spartan-ng/helm/card';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {form, FormField, required} from '@angular/forms/signals';

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
  ) {}
  //endregion: ---constructor

  //region: ---formDeclaration
  // aka react hook forms
  // but without zod validation :(
  model = signal({
    name: '', // Name
    permissions: '',
  })

  // Oh, they actually have zod validation 0_0
  groupEditForm = form(this.model, schemaPath => {
    required(schemaPath.name, {message: "Name is required"})
  })
  //endregion: ---formDeclaration

  // Server Error
  errorMessage = signal('')

  saveGroup(event: any) {
    event.preventDefault();

    //TODO
  }
}
