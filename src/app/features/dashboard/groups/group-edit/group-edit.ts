import {Component, signal} from '@angular/core';
import {GroupEditChild} from '../group-edit-child/group-edit-child';
import {Group} from '../../users/_schemas/user.schema';
import {dashboardGroupsRoute} from '../../../../shared/utils/paths';
import {Router} from '@angular/router';

@Component({
  selector: 'app-group-edit',
  imports: [
    GroupEditChild
  ],
  templateUrl: './group-edit.html',
})
export class GroupEdit {
  constructor(
    private readonly router: Router
  ) {}

  group = signal<Group>(new Group('', []))

  saved(savedGroup: Group) {
    this.router.navigateByUrl(dashboardGroupsRoute)
  }
}
