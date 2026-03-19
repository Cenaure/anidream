import {Component, OnInit, signal} from '@angular/core';
import {GroupEditChild} from '../group-edit-child/group-edit-child';
import {Group} from '../../users/_schemas/user.schema';
import {dashboardListGroupsRoute} from '../../../../shared/utils/paths';
import {ActivatedRoute, Router} from '@angular/router';
import {map, tap} from 'rxjs';

@Component({
  selector: 'app-group-edit',
  imports: [
    GroupEditChild
  ],
  templateUrl: './group-edit.html',
})
export class GroupEdit implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  group = signal<Group>(new Group('', []))

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id') || undefined),
      tap(id => {
        this.group.set({...this.group(), id});
      })).subscribe()
  }

  saved(savedGroup: Group) {
    console.log(savedGroup)
    this.router.navigateByUrl(dashboardListGroupsRoute)
  }
}
